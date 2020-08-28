import { doesExist, InvalidArgumentError } from '@apextoaster/js-utils';
import { Container } from 'noicejs';
import { alea } from 'seedrandom';

import { initConfig } from './config';
import { Commands, createParser } from './config/args';
import { dotGraph, graphProject } from './graph';
import { BunyanLogger } from './logger/bunyan';
import { RemoteModule } from './module/RemoteModule';
import { Remote, RemoteOptions } from './remote';
import { syncIssueLabels, SyncOptions, syncProjectLabels } from './sync';
import { defaultUntil } from './utils';
import { VERSION_INFO } from './version';

export { FlagLabel, StateLabel } from './labels';
export { Remote, RemoteOptions } from './remote';
export { GithubRemote } from './remote/github';
export { GitlabRemote } from './remote/gitlab';
export { resolveLabels } from './resolve';
export { syncIssueLabels, syncProjectLabels } from './sync';

const SLICE_ARGS = 2;

export async function main(argv: Array<string>): Promise<number> {
  let mode = Commands.UNKNOWN as Commands;
  const parser = createParser((argMode) => mode = argMode as Commands);
  const args = parser.parse(argv.slice(SLICE_ARGS));
  const config = await initConfig(args.config);
  const logger = BunyanLogger.create(config.logger);

  logger.info({
    mode,
    version: VERSION_INFO,
  }, 'running main');
  logger.debug({
    args,
    config,
  }, 'runtime data');

  const container = Container.from(new RemoteModule());
  await container.configure();

  for (const project of config.projects) {
    const { name } = project;

    if (doesExist(args.project) && !args.project.includes(name)) {
      logger.info({ project: name }, 'skipping project');
      continue;
    }

    const remote = await container.create<Remote, RemoteOptions>(project.remote.type, {
      data: project.remote.data,
      dryrun: defaultUntil(args.dryrun, project.remote.dryrun, false),
      logger,
      type: project.remote.type,
    });

    const connected = await remote.connect();
    if (!connected) {
      logger.error({ type: project.remote.type }, 'unable to connect to remote');
      return 1;
    }

    // mode switch
    const options: SyncOptions = {
      logger,
      project,
      random: alea(name),
      remote,
    };
    switch (mode) {
      case Commands.GRAPH:
        const graph = graphProject(project);
        process.stdout.write(dotGraph(graph));
        break;
      case Commands.ISSUES:
        await syncIssueLabels(options);
        break;
      case Commands.LABELS:
        await syncProjectLabels(options);
        break;
      default:
        throw new InvalidArgumentError('unknown command');
    }
  }

  return 0;
}

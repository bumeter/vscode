// Bumeter's status bar item: click opens the Overview. No `vscode` here, so it is tested in plain Node.
import type { Lang } from '@bumeter/vscode-kit/format';
import type { StatusOptions } from '@bumeter/vscode-kit/status';
import { t } from './strings';

export function bumeterStatus(lang: Lang): StatusOptions {
  return {
    id: 'bumeter.status',
    name: 'Bumeter',
    click: 'bumeter.openOverview',
    fallback: 'Bumeter',
    noLimits: t(lang, 'noLimits'),
    links: [{ label: t(lang, 'openOverview'), command: 'bumeter.openOverview' }, { label: t(lang, 'refresh'), command: 'bumeter.refresh' }],
  };
}

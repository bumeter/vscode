import { describe, expect, it } from 'vitest';
import { bumeterStatus } from '../src/options';
import { t } from '../src/strings';

describe('bumeterStatus', () => {
  it('click and the first link open the Overview; texts follow the language', () => {
    const en = bumeterStatus('en');
    expect(en.click).toBe('bumeter.openOverview');
    expect(en.links.map((l) => l.command)).toEqual(['bumeter.openOverview', 'bumeter.refresh']);
    expect(en.noLimits).toContain('bum statusline');
    expect(bumeterStatus('vi').links[0].label).toBe('Mở Overview');
  });
});

describe('strings', () => {
  it('Explorer marks wording', () => {
    expect(t('en', 'reads', { n: 7 })).toBe('Read 7 times by agents in 7 days');
    expect(t('vi', 'reads', { n: 7 })).toBe('Agent đọc 7 lần trong 7 ngày');
  });
});

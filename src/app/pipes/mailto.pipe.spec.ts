import { MailtoPipe } from './mailto.pipe';

describe('MailtoPipe', () => {

  it('create an instance', () => {
    const pipe = new MailtoPipe();
    expect(pipe).toBeTruthy();
  });

  it('should prefix email address with mailto:', () => {
    const pipe = new MailtoPipe();
    expect(pipe.transform('emma.peel@gmail.com')).toBe('mailto:emma.peel@gmail.com');
  });
});

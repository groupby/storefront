import Submit from '../../src/submit';
import suite from './_suite';

suite('Submit', ({ expect, spy, itShouldConsumeAlias, itShouldProvideAlias }) => {
  let submit: Submit;

  beforeEach(() => (submit = new Submit()));

  itShouldConsumeAlias(Submit, 'query');
  itShouldProvideAlias(Submit, 'submit');

  describe('constructor()', () => {
    describe('state', () => {
      describe('onClick()', () => {
        it('should call $query.submit()', () => {
          const submitQuery = spy();
          submit.$query = <any>{ submit: submitQuery };

          submit.state.onClick();

          expect(submitQuery).to.be.called;
        });

        it('should not call $query.submit() if no $query', () => {
          expect(() => submit.state.onClick()).to.not.throw();
        });
      });
    });
  });
});

import React from 'react';
import { generateAuthorKeypair, isErr, AuthorKeypair } from 'earthstar';
import { useCurrentAuthor } from '../hooks';

type NewKeypairFormProps = {
  onSuccess?: (keypair: AuthorKeypair) => void;
};

export default function NewKeypairForm({ onSuccess }: NewKeypairFormProps) {
  const [currentAuthor, setCurrentAuthor] = useCurrentAuthor();
  const [shortName, setShortName] = React.useState('');

  const onCreate = React.useCallback(() => {
    const keypair = generateAuthorKeypair(shortName);

    if (isErr(keypair)) {
      alert(keypair.message);
      return;
    }

    if (currentAuthor) {
      const res = window.confirm(
        'This will replace the currently signed in author. Proceed?'
      );

      if (!res) {
        return;
      }
    }

    setShortName('');
    setCurrentAuthor(keypair);

    if (onSuccess) {
      onSuccess(keypair);
    }
  }, [setCurrentAuthor, shortName, currentAuthor, onSuccess]);

  return (
    <form
      data-react-earthstar-keypair-form
      onSubmit={e => {
        e.preventDefault();

        onCreate();
      }}
    >
      <label
        data-react-earthstar-keypair-form-shortname-label
        data-react-earthstar-label
        htmlFor={'short-name-input'}
      >
        Short name
      </label>
      <input
        data-react-earthstar-keypair-form-shortname-input
        data-react-earthstar-input
        name={'short-name-input'}
        placeholder={'4-letter nickname'}
        value={shortName}
        onChange={e => setShortName(e.target.value)}
      />
      <button
        data-react-earthstar-keypair-form-button
        data-react-earthstar-button
        type={'submit'}
      >
        {'Create'}
      </button>
    </form>
  );
}

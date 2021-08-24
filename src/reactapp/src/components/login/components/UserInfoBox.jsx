import React from 'react';
import _get from 'lodash.get';

import Button from '../../common/Button';
import { __mt } from '../../../i18n';
import useLoginAppContext from '../hooks/useLoginAppContext';
import useLoginFormContext from '../hooks/useLoginFormContext';

function UserInfoBox() {
  const { isLoggedIn, customer } = useLoginAppContext();
  const { editMode, loginFormValues, setFormToEditMode } =
    useLoginFormContext();

  if (editMode) {
    return <></>;
  }

  return (
    <>
      <div className="py-2">
        <span className="flex flex-wrap items-center justify-center">
          {isLoggedIn && (
            <>
              <span>{_get(customer, 'fullName')}</span>
              <span>{`(${_get(customer, 'email')})`}</span>
            </>
          )}
          {!isLoggedIn && _get(loginFormValues, 'email')}
        </span>
      </div>

      {!isLoggedIn && (
        <div className="flex items-center justify-center">
          <Button click={setFormToEditMode} variant="secondary">
            {__mt('Edit')}
          </Button>
        </div>
      )}
    </>
  );
}

export default UserInfoBox;

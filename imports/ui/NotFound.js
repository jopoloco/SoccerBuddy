import React from 'react';
import {Link} from 'react-router-dom';

function NotFound() {
  return (
    <div className="boxedView">
      <div className="boxedView_box">
        <h1>Page Note Found</h1>
        <p>Hmmm, we're unable to find that page</p>
        <Link to="/" className="button button-link">HEAD HOME</Link>
      </div>
    </div>
  );
}

export default NotFound;
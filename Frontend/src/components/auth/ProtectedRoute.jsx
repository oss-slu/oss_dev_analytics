/*
  Temporary ProtectedRoute
  Bypassing authentication for local testing so pages can load
*/

import React from 'react';

export default function ProtectedRoute({ children }) {
  // directly return children instead of checking auth
  return children;
}
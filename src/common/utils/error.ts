export function stringifyError(err: any) {
  if (err instanceof Error) {
    return JSON.stringify(
      { name: err.name, message: err.message, stack: err.stack },
      null,
      2
    );
  }

  return JSON.stringify(err, null, 2);
}

export function sanitizeError(err: any) {
  return JSON.parse(stringifyError(err));
}

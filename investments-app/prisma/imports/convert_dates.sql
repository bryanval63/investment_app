UPDATE Investment
SET date = replace(
  strftime('%Y-%m-%dT%H:%M:%fZ', date),
  'Z',
  '+00:00'
);
import { useEffect } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';

export const LastUpdatedField = wrapFieldsWithMeta(({ input }) => {
  // Automatically set current time when the form changes
  useEffect(() => {
    const now = new Date().toISOString();
    input.onChange(now);
  }, [input]);

  // Display formatted date if exists
  const formatted = input.value ? new Date(input.value).toLocaleString() : 'Not yet saved';

  return (
    <div className="p-2 text-sm text-gray-700">
      <strong>Last Updated:</strong> {formatted}
    </div>
  );
});

/**
 *
 * Add the app configurations as constants here and export them to be used on
 * the app module.
 *
 */
export const PASSWORD_PATTERN = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$';
export const NAME_PATTERN = '^[A-Za-z]+[ \t]?[A-Za-z- ]+?[ \t]*$';
export const POSTAL_PATTERN = '^\d{5}(-\d{4})?$';
export const NUMBERS_ONLY_PATTERN = '^[0-9]*$';
export const EBB_NAME_PATTERN = '^[a-zA-Z-\'\` ]*$';
export const ALPHANUMERIC_PATTERN = '^[a-zA-Z0-9_ ]*$';
export const EMAIL_PATTERN = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$';
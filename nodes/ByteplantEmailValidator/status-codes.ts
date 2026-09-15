const valid = [
	{
		code: 200,
		status: 'OK - Valid Address',
		description: 'The mail address is valid',
		retry: false,
		category: 'valid',
	},
	{
		code: 207,
		status: 'OK - Catch-All Active',
		description:
			'The mail server for this domain accepts the address, but it also implements a catch-all policy. For this reason, it is not possible to determine if a mail account with this name actually exists, without sending a message and waiting for a reply.',
		retry: false,
		category: 'valid',
	},
	{
		code: 215,
		status: 'OK - Catch-All Test Delayed',
		description:
			'The mail server for this domain accepts the address, the Catch-All test returned a temporary error (API only).',
		retry: true,
		category: 'valid',
	},
];

const suspect = [
	{
		code: 302,
		status: 'Local Address',
		description:
			'The mail address lacks the domain qualifier. It may work locally within some organization, but otherwise it is unusable.',
		retry: false,
		category: 'suspect',
	},
	{
		code: 303,
		status: 'IP Address Literal',
		description:
			'The mail address is syntactically correct, but the domain part defines an IP address. This kind of address may work, but is usually only used by spammers, or for testing purposes.',
		retry: false,
		category: 'suspect',
	},
	{
		code: 305,
		status: 'Disposable Address',
		description:
			'The mail address is provided by a disposable email address service. Disposable addresses only work for a limited amount of time, or for a limited amount of messages.',
		retry: false,
		category: 'suspect',
	},
	{
		code: 308,
		status: 'Role Address',
		description:
			'The mail address is a role address and typically not associated with a particular person.',
		retry: false,
		category: 'suspect',
	},
	{
		code: 313,
		status: 'Server Unavailable',
		description: 'The mail server for this domain could not be contacted, or did not respond.',
		retry: true,
		category: 'suspect',
	},
	{
		code: 314,
		status: 'Address Unavailable',
		description:
			'The mail server for this domain responded with an error condition for this address.',
		retry: true,
		category: 'suspect',
	},
	{
		code: 316,
		status: 'Duplicate Address',
		description:
			'The address is a duplicate of an address that has already been processed (batch processing only).',
		retry: false,
		category: 'suspect',
	},
	{
		code: 317,
		status: 'Server Reject',
		description:
			'The server refuses to answer to SMTP commands, probably because some very strict anti-spam measures are in effect.',
		retry: false,
		category: 'suspect',
	},
];

const invalid = [
	{
		code: 401,
		status: 'Bad Address',
		description: 'The mail address failed to pass basic syntax checks.',
		retry: false,
		category: 'invalid',
	},
	{
		code: 404,
		status: 'Domain Not Fully Qualified',
		description:
			'The mail address is syntactically correct, but the domain part of the mail address is not fully qualified, and the address is not usable.',
		retry: false,
		category: 'invalid',
	},
	{
		code: 406,
		status: 'MX Lookup Error',
		description:
			'There is no valid DNS MX record associated with this domain, or one or more MX entries lack an A record. Messages to this domain cannot be delivered.',
		retry: false,
		category: 'invalid',
	},
	{
		code: 409,
		status: 'No-Reply Address',
		description:
			'The mail address appears to be a no-reply address, and is not usable as a recipient of email messages.',
		retry: false,
		category: 'invalid',
	},
	{
		code: 410,
		status: 'Address Rejected',
		description:
			'The mail server for the recipient domain does not accept messages to this address.',
		retry: false,
		category: 'invalid',
	},
	{
		code: 413,
		status: 'Server Unavailable',
		description:
			'The mail server for this domain could not be contacted, or did not accept mail over an extended period of time.',
		retry: false,
		category: 'invalid',
	},
	{
		code: 414,
		status: 'Address Unavailable',
		description:
			'The mail server for this domain responded with an error condition for this address over an extended period of time.',
		retry: false,
		category: 'invalid',
	},
	{
		code: 420,
		status: 'Domain Name Misspelled',
		description: 'The domain name is probably misspelled.',
		retry: false,
		category: 'invalid',
	},
];

const indeterminate = [
	{
		code: 114,
		status: 'Validation Delayed',
		description: 'SMTP address validation is still in progress (API only).',
		retry: true,
		category: 'indeterminate',
	},
	{
		code: 118,
		status: 'Rate Limit Exceeded',
		description: 'The API rate limit for your account has been exceeded (API only).',
		retry: true,
		category: 'indeterminate',
	},
	{
		code: 119,
		status: 'API Key Invalid or Depleted',
		description: 'The API key is invalid, or the account balance is depleted (API only).',
		retry: false,
		category: 'indeterminate',
	},
	{
		code: 121,
		status: 'Task Accepted',
		description: 'The validation task was accepted.',
		retry: false,
		category: 'indeterminate',
	},
];

export const statusCodes = [...valid, ...suspect, ...invalid, ...indeterminate];

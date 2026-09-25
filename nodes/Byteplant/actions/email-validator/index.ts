import type { INodeProperties } from 'n8n-workflow';
import { description as validateDescription } from './validate.operation';

export { execute as validate } from './validate.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['email'] } },
		options: [
			{
				name: 'Validate',
				value: 'validate',
				action: 'Validate an email address',
				description: 'Check whether an email address is deliverable and get details about it',
			},
		],
		default: 'validate',
	},
	...validateDescription,
];

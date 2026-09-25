import type { INodeProperties } from 'n8n-workflow';
import { description as validateDescription } from './validate.operation';

export { execute as validate } from './validate.operation';

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['address'] } },
		options: [
			{
				name: 'Validate',
				value: 'validate',
				action: 'Validate an address',
				description: 'Check and standardize a postal address and get details about it',
			},
		],
		default: 'validate',
	},
	...validateDescription,
];

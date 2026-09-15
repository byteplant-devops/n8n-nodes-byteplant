import { INodeProperties } from 'n8n-workflow';

export const commonFields: Record<string, INodeProperties> = {
	Timeout: {
		displayName: 'Timeout',
		name: 'Timeout',
		default: 10,
		placeholder: '',
		type: 'number',
		description: 'Timeout in seconds (default 10s, min 5s, max 300s)',
		typeOptions: {
			maxValue: 300,
			minValue: 5,
		},
	},
};

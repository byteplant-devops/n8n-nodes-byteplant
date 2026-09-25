import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import * as address from './actions/address-validator';
import * as email from './actions/email-validator';
import * as phone from './actions/phone-validator';

const resources = { address, email, phone };

export class Byteplant implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Byteplant',
		name: 'byteplant',
		icon: {
			light: 'file:byteplant.png',
			dark: 'file:byteplant.png',
		},
		group: [],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Validate email addresses, phone numbers and postal addresses',
		defaults: {
			name: 'Byteplant',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,

		credentials: [
			{
				name: 'byteplantAddressValidatorApi',
				required: true,
				displayOptions: { show: { resource: ['address'] } },
			},
			{
				name: 'byteplantEmailValidatorApi',
				required: true,
				displayOptions: { show: { resource: ['email'] } },
			},
			{
				name: 'byteplantPhoneValidatorApi',
				required: true,
				displayOptions: { show: { resource: ['phone'] } },
			},
		],

		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Address Validator', value: 'address' },
					{ name: 'Email Validator', value: 'email' },
					{ name: 'Phone Validator', value: 'phone' },
				],
				default: 'email',
			},
			...address.description,
			...email.description,
			...phone.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as keyof typeof resources;
		const operation = this.getNodeParameter('operation', 0) as 'validate';

		for (let i = 0; i < items.length; i++) {
			try {
				const json = await resources[resource][operation].call(this, i);
				returnData.push({ ...items[i], json, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					continue;
				}
				throw error instanceof NodeApiError
					? error
					: new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}

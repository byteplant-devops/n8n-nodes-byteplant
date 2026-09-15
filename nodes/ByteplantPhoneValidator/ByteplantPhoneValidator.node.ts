import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
} from 'n8n-workflow';
import { ApplicationError, NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { commonFields } from '../../utils/common-fields';

export class ByteplantPhoneValidator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Byteplant Phone Validator',
		name: 'byteplantPhoneValidator',
		group: [],
		icon: {
			light: 'file:byteplant-phone-validator.png',
			dark: 'file:byteplant-phone-validator.png',
		},
		version: 1,
		description: 'Byteplant Phone Validator',
		defaults: {
			name: 'Byteplant Phone Validator',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				displayName: 'Byteplant Phone Validator API',
				name: 'byteplantPhoneValidatorApi',
				required: true,
			},
		],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'validatePhoneNumber',
				options: [
					{
						name: 'Validate Phone Number',
						value: 'validatePhoneNumber',
					},
				],
			},
			{
				displayName: 'Phone Number',
				name: 'PhoneNumber',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'Phone number to validate',
				required: true,
			},
			{
				displayName: 'Country Code',
				name: 'CountryCode',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'Two letter ISO 3166-1 country code',
			},
			{
				displayName: 'Locale',
				name: 'Locale',
				type: 'string',
				default: 'en-US',
				placeholder: '',
				description: 'IETF language tag for Geocoding',
			},
			{
				displayName: 'Mode',
				name: 'Mode',
				type: 'options',
				default: 'extensive',
				options: [
					{
						name: 'Extensive',
						value: 'extensive',
					},
					{
						name: 'Express',
						value: 'express',
					},
				],
			},
			commonFields.Timeout,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const operation = this.getNodeParameter('operation', itemIndex);
			if (operation === 'validatePhoneNumber') {
				try {
					const options: IRequestOptions = {
						method: 'GET',
						baseURL: 'https://api.phone-validator.net',
						url: '/api/v2/verify',
						qs: {
							PhoneNumber: this.getNodeParameter('PhoneNumber', itemIndex, '') as string,
							CountryCode: this.getNodeParameter('CountryCode', itemIndex, '') as string,
							Locale: this.getNodeParameter('Locale', itemIndex, '') as string,
							Mode: this.getNodeParameter('Mode', itemIndex, '') as string,
							Timeout: this.getNodeParameter('Timeout', itemIndex, 10) as number,
						},
						json: true,
					};

					const { ratelimit_remain, ratelimit_seconds, status, ...rest } =
						await this.helpers.requestWithAuthentication.call(
							this,
							'byteplantPhoneValidatorApi',
							options,
						);

					if (status === 'API_KEY_INVALID_OR_DEPLETED') {
						throw new ApplicationError('API Key Invalid or Depleted');
					}

					item = items[itemIndex];
					item.json = { status, ...rest };
				} catch (error) {
					if (this.continueOnFail()) {
						items.push({
							json: this.getInputData(itemIndex)[0].json,
							error,
							pairedItem: itemIndex,
						});
					} else {
						if (error.context) {
							error.context.itemIndex = itemIndex;
							throw error;
						}
						throw new NodeOperationError(this.getNode(), error, {
							itemIndex,
						});
					}
				}
			}
		}

		return [items];
	}
}

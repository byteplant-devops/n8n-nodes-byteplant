import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
} from 'n8n-workflow';
import { ApplicationError, NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { commonFields } from '../../utils/common-fields';

export class ByteplantAddressValidator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Byteplant Address Validator',
		name: 'byteplantAddressValidator',
		group: [],
		icon: {
			light: 'file:byteplant-address-validator.png',
			dark: 'file:byteplant-address-validator.png',
		},
		version: 1,
		description: 'Byteplant Address Validator',
		defaults: {
			name: 'Byteplant Address Validator',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				displayName: 'Byteplant Address Validator API',
				name: 'byteplantAddressValidatorApi',
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
				default: 'validateAddress',
				options: [
					{
						name: 'Validate Address',
						value: 'validateAddress',
					},
				],
			},
			{
				displayName: 'Country Code',
				name: 'CountryCode',
				default: '',
				placeholder: '',
				type: 'string',
				description: 'Two-letter ISO 3166-1 country code',
				required: true,
			},
			{
				displayName: 'Street Address',
				name: 'StreetAddress',
				default: '',
				placeholder: '',
				type: 'string',
				required: true,
			},
			{
				displayName: 'City',
				name: 'City',
				default: '',
				placeholder: '',
				type: 'string',
			},
			{
				displayName: 'Additional Address Info',
				name: 'AdditionalAddressInfo',
				default: '',
				placeholder: '',
				type: 'string',
				description: 'Apt/Suite/Additional address info',
			},
			{
				displayName: 'Postal Code',
				name: 'PostalCode',
				default: '',
				placeholder: '',
				type: 'string',
				description: 'Zip/Postal code',
			},
			{
				displayName: 'State',
				name: 'State',
				default: '',
				placeholder: '',
				type: 'string',
				description: 'State/Province',
			},
			{
				displayName: 'Geocoding',
				name: 'Geocoding',
				default: false,
				placeholder: '',
				type: 'boolean',
				description: 'Whether to enable Geocoding',
			},
			{
				displayName: 'Street Number',
				name: 'StreetNumber',
				default: '',
				placeholder: '',
				type: 'string',
				description:
					'Housenumber/Building can either be part of StreetAddress or be provided separately',
			},
			{
				displayName: 'Locale',
				name: 'Locale',
				default: '',
				placeholder: '',
				type: 'string',
				description:
					"IETF language tag - for some countries, only English and the preferred local language used by the country's postal service is supported",
			},
			{
				displayName: 'Output Charset',
				name: 'OutputCharset',
				default: 'utf-8',
				type: 'options',
				options: [
					{
						name: 'us-ascii',
						value: 'us-ascii',
					},
					{
						name: 'utf-8',
						value: 'utf-8',
					},
				],
				description: 'Output character set [us-ascii|utf-8]',
			},
			commonFields.Timeout,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const operation = this.getNodeParameter('operation', itemIndex);

			if (operation === 'validateAddress') {
				try {
					const options: IRequestOptions = {
						method: 'GET',
						baseURL: 'https://api.address-validator.net',
						url: '/api/verify',
						qs: {
							StreetAddress: this.getNodeParameter('StreetAddress', itemIndex, '') as string,
							City: this.getNodeParameter('City', itemIndex, '') as string,
							AdditionalAddressInfo: this.getNodeParameter(
								'AdditionalAddressInfo',
								itemIndex,
								'',
							) as string,
							PostalCode: this.getNodeParameter('PostalCode', itemIndex, '') as string,
							State: this.getNodeParameter('State', itemIndex, '') as string,
							CountryCode: this.getNodeParameter('CountryCode', itemIndex, '') as string,
							StreetNumber: this.getNodeParameter('StreetNumber', itemIndex, '') as string,
							Locale: this.getNodeParameter('Locale', itemIndex, '') as string,
							Geocoding: this.getNodeParameter('Geocoding', itemIndex, false) as boolean,
							Timeout: this.getNodeParameter('Timeout', itemIndex, 10) as number,
							OutputCharset: this.getNodeParameter('OutputCharset', itemIndex, 'utf-8') as string,
						},
						json: true,
					};

					const { ratelimit_remain, ratelimit_seconds, status, ...rest } =
						await this.helpers.requestWithAuthentication.call(
							this,
							'byteplantAddressValidatorApi',
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

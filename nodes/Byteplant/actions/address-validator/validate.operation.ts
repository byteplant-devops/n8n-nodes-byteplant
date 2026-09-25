import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeProperties,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, updateDisplayOptions } from 'n8n-workflow';
import { commonFields } from '../common.descriptions';

const properties: INodeProperties[] = [
	{
		displayName: 'Country Code',
		name: 'CountryCode',
		default: '',
		placeholder: '',
		type: 'string',
		description: 'Two-letter ISO 3166-1 country code, set to XX for international',
		required: true,
	},
	{
		displayName: 'Street Address',
		name: 'StreetAddress',
		default: '',
		placeholder: '',
		type: 'string',
		description: 'Street/house number/building, may include unit/apt',
		required: true,
	},
	{
		displayName: 'City',
		name: 'City',
		default: '',
		placeholder: '',
		type: 'string',
		description: 'City or locality (city, district)',
	},
	{
		displayName: 'Additional Address Info',
		name: 'AdditionalAddressInfo',
		default: '',
		placeholder: '',
		type: 'string',
		description: 'Building/unit/apt/floor',
	},
	{
		displayName: 'Postal Code',
		name: 'PostalCode',
		default: '',
		placeholder: '',
		type: 'string',
		description: 'ZIP/postal code',
	},
	{
		displayName: 'State',
		name: 'State',
		default: '',
		placeholder: '',
		type: 'string',
		description: 'State/province',
	},
	{
		displayName: 'Geocoding',
		name: 'Geocoding',
		default: false,
		placeholder: '',
		type: 'boolean',
		description: 'Whether to enable geocoding',
	},
	{
		displayName: 'Street Number',
		name: 'StreetNumber',
		default: '',
		placeholder: '',
		type: 'string',
		description: 'House number/building, can be part of Street Address or provided separately',
	},
	{
		displayName: 'Locale',
		name: 'Locale',
		default: '',
		placeholder: '',
		type: 'string',
		description:
			'Output language for countries with multiple postal languages. Use only to translate addresses; leave empty for address validation.',
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
];

const displayOptions = {
	show: {
		resource: ['address'],
		operation: ['validate'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
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

	let response: IDataObject;
	try {
		response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'byteplantAddressValidatorApi',
			options,
		);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
	}

	const { ratelimit_remain, ratelimit_seconds, status, ...rest } = response;
	if (status === 'API_KEY_INVALID_OR_DEPLETED') {
		throw new NodeApiError(this.getNode(), response as JsonObject, {
			message: 'API key invalid or depleted',
			itemIndex,
		});
	}

	return { status, ...rest };
}

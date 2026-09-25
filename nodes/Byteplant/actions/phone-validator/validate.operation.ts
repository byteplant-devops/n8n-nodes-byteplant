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
		displayName: 'Phone Number',
		name: 'PhoneNumber',
		type: 'string',
		default: '',
		placeholder: '',
		description:
			'Phone number to validate, in national format or in international format with a leading +',
		required: true,
	},
	{
		displayName: 'Country Code',
		name: 'CountryCode',
		type: 'string',
		default: '',
		placeholder: '',
		description:
			'Two-letter ISO 3166-1 country code. Optional if the phone number is in international format.',
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
		description: 'Express (static checks only) or extensive (full validation)',
	},
	commonFields.Timeout,
];

const displayOptions = {
	show: {
		resource: ['phone'],
		operation: ['validate'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
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

	let response: IDataObject;
	try {
		response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'byteplantPhoneValidatorApi',
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

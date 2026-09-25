import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeProperties,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, updateDisplayOptions } from 'n8n-workflow';
import { commonFields } from '../common.descriptions';
import { statusCodes } from '../../helpers/ev-status-codes';

const properties: INodeProperties[] = [
	{
		displayName: 'Email Address',
		name: 'EmailAddress',
		type: 'string',
		default: '',
		placeholder: '',
		description: 'Email address to validate',
		required: true,
	},
	commonFields.Timeout,
];

const displayOptions = {
	show: {
		resource: ['email'],
		operation: ['validate'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method: 'GET',
		baseURL: 'https://api.email-validator.net',
		url: '/api/verify',
		qs: {
			EmailAddress: this.getNodeParameter('EmailAddress', itemIndex, '') as string,
			Timeout: this.getNodeParameter('Timeout', itemIndex, 10) as number,
		},
		json: true,
	};

	let response: IDataObject;
	try {
		response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'byteplantEmailValidatorApi',
			options,
		);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
	}

	const { status, info, details, freemail } = response;
	if (status === 119) {
		throw new NodeApiError(this.getNode(), response as JsonObject, {
			message: 'API key invalid or depleted',
			itemIndex,
		});
	}

	const { category } = statusCodes.find((item) => item.code === status) || {};

	return { status, info, details, freemail, category };
}

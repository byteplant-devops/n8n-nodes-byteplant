import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
} from 'n8n-workflow';
import { ApplicationError, NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { statusCodes } from './status-codes';
import { commonFields } from '../../utils/common-fields';

export class ByteplantEmailValidator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Byteplant Email Validator',
		name: 'byteplantEmailValidator',
		group: [],
		icon: {
			light: 'file:byteplant-email-validator.png',
			dark: 'file:byteplant-email-validator.png',
		},
		version: 1,
		description: 'Byteplant Email Validator',
		defaults: {
			name: 'Byteplant Email Validator',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				displayName: 'Byteplant Email Validator API',
				name: 'byteplantEmailValidatorApi',
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
				default: 'validateEmail',
				options: [
					{
						name: 'Validate Email',
						value: 'validateEmail',
					},
				],
			},
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const operation = this.getNodeParameter('operation', itemIndex);
			if (operation === 'validateEmail') {
				try {
					const options: IRequestOptions = {
						method: 'GET',
						baseURL: 'https://api.email-validator.net',
						url: '/api/verify',
						qs: {
							EmailAddress: this.getNodeParameter('EmailAddress', itemIndex, '') as string,
							Timeout: this.getNodeParameter('Timeout', itemIndex, 10) as number,
						},
						json: true,
					};

					const { status, info, details, freemail } =
						await this.helpers.requestWithAuthentication.call(
							this,
							'byteplantEmailValidatorApi',
							options,
						);

					if (status === 119) {
						throw new ApplicationError('API Key Invalid or Depleted');
					}

					const { category } = statusCodes.find((item) => item.code === status) || {};

					item = items[itemIndex];
					item.json = {
						status,
						info,
						details,
						freemail,
						category,
					};
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

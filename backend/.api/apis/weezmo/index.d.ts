import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values: string[] | number[]): this;
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url: string, variables?: {}): void;
    /**
     * Create or update list of contacts.
     * Max number of contacts per request: 5000 contacts.
     *
     * @summary Create or Update
     * @throws FetchError<400, types.PostApiContactsCreateorupdateResponse400> Bad Request
     * @throws FetchError<401, types.PostApiContactsCreateorupdateResponse401> Unauthorized
     */
    postApiContactsCreateorupdate(body?: types.PostApiContactsCreateorupdateBodyParam): Promise<FetchResponse<200, types.PostApiContactsCreateorupdateResponse200>>;
    /**
     * Returns current consents this user has with last update date for subscribe or
     * unsubscribe.
     *
     * @summary Get contact status
     * @throws FetchError<400, types.PostApiContactsGetcontactstatusResponse400> Bad Request
     * @throws FetchError<401, types.PostApiContactsGetcontactstatusResponse401> Unauthorized
     */
    postApiContactsGetcontactstatus(body?: types.PostApiContactsGetcontactstatusBodyParam): Promise<FetchResponse<200, types.PostApiContactsGetcontactstatusResponse200>>;
    /**
     * Returns list of all unsubscribed contacts.
     *
     * @summary Get unsubscribers list
     * @throws FetchError<401, types.GetApiUnsubscribeListResponse401> Unauthorized
     */
    getApiUnsubscribeList(): Promise<FetchResponse<200, types.GetApiUnsubscribeListResponse200>>;
    /**
     * Unsubscribe one or more contacts from SMS/Email or both.
     * Phone or Email are required.
     *
     * @summary Unsubscribe
     * @throws FetchError<400, types.PostApiUnsubscribeResponse400> Bad Request
     * @throws FetchError<401, types.PostApiUnsubscribeResponse401> Unauthorized
     */
    postApiUnsubscribe(body?: types.PostApiUnsubscribeBodyParam): Promise<FetchResponse<200, types.PostApiUnsubscribeResponse200>>;
    /**
     * Send SMS via Weezmo, using target and SMS content.
     *
     * @summary Send SMS
     * @throws FetchError<400, types.PostV3ExternalSendsmsResponse400> Bad Request
     * @throws FetchError<401, types.PostV3ExternalSendsmsResponse401> Unauthorized
     */
    postV3ExternalSendsms(body: types.PostV3ExternalSendsmsBodyParam): Promise<FetchResponse<200, types.PostV3ExternalSendsmsResponse200>>;
    /**
     * Send email via Weezmo, using target and email content.
     *
     * @summary Send Email
     * @throws FetchError<400, types.PostV3ExternalSendemailResponse400> Bad Request
     * @throws FetchError<401, types.PostV3ExternalSendemailResponse401> Unauthorized
     */
    postV3ExternalSendemail(body: types.PostV3ExternalSendemailBodyParam): Promise<FetchResponse<200, types.PostV3ExternalSendemailResponse200>>;
    /**
     * Create a new receipt.
     *
     * @summary Create
     * @throws FetchError<400, types.PostV3EntitiesReceiptCreateResponse400> Bad Request
     * @throws FetchError<401, types.PostV3EntitiesReceiptCreateResponse401> Unauthorized
     */
    postV3EntitiesReceiptCreate(body: types.PostV3EntitiesReceiptCreateBodyParam, metadata?: types.PostV3EntitiesReceiptCreateMetadataParam): Promise<FetchResponse<200, types.PostV3EntitiesReceiptCreateResponse200>>;
    /**
     * Create a new receipt with PDF file.
     *
     * @summary Create with PDF
     * @throws FetchError<400, types.PostV3EntitiesReceiptCreatewithpdfResponse400> Bad Request
     * @throws FetchError<401, types.PostV3EntitiesReceiptCreatewithpdfResponse401> Unauthorized
     */
    postV3EntitiesReceiptCreatewithpdf(body: types.PostV3EntitiesReceiptCreatewithpdfBodyParam, metadata?: types.PostV3EntitiesReceiptCreatewithpdfMetadataParam): Promise<FetchResponse<200, types.PostV3EntitiesReceiptCreatewithpdfResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;

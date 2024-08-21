"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'weezmo/v1 (api/6.1.2)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
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
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
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
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Create and shedule SMS Campaign for contact lists
     *
     * @summary Will create an SMS Campaign
     * @throws FetchError<400, types.PostApiSmscampaignCreateResponse400> Bad Request
     */
    SDK.prototype.postApiSmscampaignCreate = function (body) {
        return this.core.fetch('/api/SmsCampaign/create', 'post', body);
    };
    /**
     * Get status of campaign by campaignId
     *
     * @throws FetchError<400, types.GetApiSmscampaignStatusCampaignidResponse400> Bad Request
     */
    SDK.prototype.getApiSmscampaignStatusCampaignid = function (metadata) {
        return this.core.fetch('/api/SmsCampaign/status/{campaignId}', 'get', metadata);
    };
    /**
     * Create or update list of contacts.
     * Max number of contacts per request: 5000 contacts.
     *
     * @summary Create or Update
     * @throws FetchError<400, types.PostApiContactsCreateorupdateResponse400> Bad Request
     * @throws FetchError<401, types.PostApiContactsCreateorupdateResponse401> Unauthorized
     */
    SDK.prototype.postApiContactsCreateorupdate = function (body) {
        return this.core.fetch('/api/Contacts/CreateOrUpdate', 'post', body);
    };
    /**
     * Returns current consents this user has with last update date for subscribe or
     * unsubscribe.
     *
     * @summary Get contact status
     * @throws FetchError<400, types.PostApiContactsGetcontactstatusResponse400> Bad Request
     * @throws FetchError<401, types.PostApiContactsGetcontactstatusResponse401> Unauthorized
     */
    SDK.prototype.postApiContactsGetcontactstatus = function (body) {
        return this.core.fetch('/api/Contacts/GetContactStatus', 'post', body);
    };
    /**
     * Returns list of contacts page with last index id.
     * Max. number of contacts per request - 1000 contacts.
     *
     * @summary Get contacts list
     * @throws FetchError<400, types.PostApiContactsListResponse400> Bad Request
     * @throws FetchError<401, types.PostApiContactsListResponse401> Unauthorized
     */
    SDK.prototype.postApiContactsList = function (body) {
        return this.core.fetch('/api/Contacts/list', 'post', body);
    };
    /**
     * Returns list of unsubscribed contacts page with last index id.
     * Max. number of contacts per request - 1000 contacts.
     *
     * @summary Get unsubscribers list
     * @throws FetchError<401, types.PostApiUnsubscribeListResponse401> Unauthorized
     */
    SDK.prototype.postApiUnsubscribeList = function (body) {
        return this.core.fetch('/api/Unsubscribe/list', 'post', body);
    };
    /**
     * Unsubscribe one or more contacts from SMS/Email or both.
     * Phone or Email are required.
     *
     * @summary Unsubscribe
     * @throws FetchError<400, types.PostApiUnsubscribeResponse400> Bad Request
     * @throws FetchError<401, types.PostApiUnsubscribeResponse401> Unauthorized
     */
    SDK.prototype.postApiUnsubscribe = function (body) {
        return this.core.fetch('/api/Unsubscribe', 'post', body);
    };
    /**
     * Send SMS via Weezmo, using target and SMS content.
     *
     * @summary Send SMS
     * @throws FetchError<400, types.PostV3ExternalSendsmsResponse400> Bad Request
     * @throws FetchError<401, types.PostV3ExternalSendsmsResponse401> Unauthorized
     */
    SDK.prototype.postV3ExternalSendsms = function (body) {
        return this.core.fetch('/v3/External/SendSms', 'post', body);
    };
    /**
     * Send email via Weezmo, using target and email content.
     *
     * @summary Send Email
     * @throws FetchError<400, types.PostV3ExternalSendemailResponse400> Bad Request
     * @throws FetchError<401, types.PostV3ExternalSendemailResponse401> Unauthorized
     */
    SDK.prototype.postV3ExternalSendemail = function (body) {
        return this.core.fetch('/v3/External/SendEmail', 'post', body);
    };
    /**
     * Send email via Weezmo, using target and email content, including attachments.
     *
     * @summary Send Email With Attachments
     * @throws FetchError<400, types.PostV3ExternalSendemailwithattachmentsResponse400> Bad Request
     * @throws FetchError<401, types.PostV3ExternalSendemailwithattachmentsResponse401> Unauthorized
     */
    SDK.prototype.postV3ExternalSendemailwithattachments = function (body) {
        return this.core.fetch('/v3/External/SendEmailWithAttachments', 'post', body);
    };
    /**
     * Create a new receipt.
     *
     * @summary Create
     * @throws FetchError<400, types.PostV3EntitiesReceiptCreateResponse400> Bad Request
     * @throws FetchError<401, types.PostV3EntitiesReceiptCreateResponse401> Unauthorized
     */
    SDK.prototype.postV3EntitiesReceiptCreate = function (body, metadata) {
        return this.core.fetch('/v3/entities/receipt/create', 'post', body, metadata);
    };
    /**
     * Create a new receipt with PDF file.
     *
     * @summary Create with PDF
     * @throws FetchError<400, types.PostV3EntitiesReceiptCreatewithpdfResponse400> Bad Request
     * @throws FetchError<401, types.PostV3EntitiesReceiptCreatewithpdfResponse401> Unauthorized
     */
    SDK.prototype.postV3EntitiesReceiptCreatewithpdf = function (body, metadata) {
        return this.core.fetch('/v3/entities/receipt/createWithPdf', 'post', body, metadata);
    };
    /**
     * Add more files to the digital receipts (For example, warranty, insurance, etc.).
     *
     * @summary Add additional files
     * @throws FetchError<400, types.PostV2EntitiesReceiptAdditionalfileResponse400> Bad Request
     * @throws FetchError<401, types.PostV2EntitiesReceiptAdditionalfileResponse401> Unauthorized
     */
    SDK.prototype.postV2EntitiesReceiptAdditionalfile = function (body) {
        return this.core.fetch('/v2/entities/receipt/additionalFile', 'post', body);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;

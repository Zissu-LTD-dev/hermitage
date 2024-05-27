declare const GetApiUnsubscribeList: {
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly properties: {
                    readonly firstName: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly lastName: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly phone: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly email: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly additionalData: {
                        readonly type: readonly ["array", "null"];
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly key: {
                                    readonly type: readonly ["string", "null"];
                                };
                                readonly value: {
                                    readonly type: readonly ["string", "null"];
                                };
                                readonly type: {
                                    readonly enum: readonly ["String", "Number", "Date"];
                                    readonly type: "string";
                                    readonly description: "`String` `Number` `Date`";
                                };
                            };
                            readonly additionalProperties: false;
                        };
                    };
                    readonly id: {
                        readonly type: "string";
                        readonly format: "uuid";
                    };
                    readonly businessClientId: {
                        readonly type: "string";
                        readonly format: "uuid";
                    };
                    readonly target: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly unsubscribedDate: {
                        readonly type: "string";
                        readonly format: "date-time";
                    };
                    readonly campaignId: {
                        readonly type: readonly ["string", "null"];
                        readonly format: "uuid";
                    };
                    readonly campaignType: {
                        readonly enum: readonly ["SMSCampaign", "EmailCampaign"];
                        readonly type: "string";
                        readonly description: "`SMSCampaign` `EmailCampaign`";
                    };
                    readonly campaignName: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly unsubscribeSource: {
                        readonly enum: readonly ["Link", "Manual", "MarketingConsent", "List", "API", "Job", "SMS"];
                        readonly type: "string";
                        readonly description: "`Link` `Manual` `MarketingConsent` `List` `API` `Job` `SMS`";
                    };
                    readonly consentTags: {
                        readonly enum: readonly ["SMS", "Email", "Marketing", "Cookie"];
                        readonly type: "string";
                        readonly description: "`SMS` `Email` `Marketing` `Cookie`";
                    };
                    readonly contactListId: {
                        readonly type: readonly ["string", "null"];
                        readonly format: "uuid";
                    };
                    readonly contactListName: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly reason: {
                        readonly type: readonly ["string", "null"];
                    };
                };
                readonly additionalProperties: false;
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostApiContactsCreateorupdate: {
    readonly body: {
        readonly type: "array";
        readonly items: {
            readonly type: "object";
            readonly properties: {
                readonly firstName: {
                    readonly type: readonly ["string", "null"];
                };
                readonly lastName: {
                    readonly type: readonly ["string", "null"];
                };
                readonly phone: {
                    readonly type: readonly ["string", "null"];
                };
                readonly email: {
                    readonly type: readonly ["string", "null"];
                };
                readonly createdDate: {
                    readonly type: readonly ["string", "null"];
                    readonly format: "date-time";
                };
                readonly addToListName: {
                    readonly type: readonly ["string", "null"];
                };
                readonly customFields: {
                    readonly type: readonly ["array", "null"];
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly name: {
                                readonly type: readonly ["string", "null"];
                            };
                            readonly type: {
                                readonly type: readonly ["string", "null"];
                            };
                            readonly value: {
                                readonly type: readonly ["string", "null"];
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
            };
            readonly additionalProperties: false;
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly success: {
                    readonly type: "boolean";
                };
                readonly message: {
                    readonly type: readonly ["string", "null"];
                };
            };
            readonly additionalProperties: false;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly success: {
                    readonly type: "boolean";
                };
                readonly message: {
                    readonly type: readonly ["string", "null"];
                };
            };
            readonly additionalProperties: false;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostApiContactsGetcontactstatus: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly email: {
                readonly type: readonly ["string", "null"];
            };
            readonly phone: {
                readonly type: readonly ["string", "null"];
            };
        };
        readonly additionalProperties: false;
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly properties: {
                    readonly phone: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly email: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly existingConsentTags: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly unsubscribeConsentTags: {
                        readonly type: readonly ["string", "null"];
                    };
                };
                readonly additionalProperties: false;
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostApiUnsubscribe: {
    readonly body: {
        readonly type: "array";
        readonly items: {
            readonly type: "object";
            readonly properties: {
                readonly phone: {
                    readonly type: readonly ["string", "null"];
                };
                readonly email: {
                    readonly type: readonly ["string", "null"];
                };
                readonly unsubscribeDate: {
                    readonly type: "string";
                    readonly format: "date-time";
                };
                readonly unsubscribeSource: {
                    readonly type: readonly ["string", "null"];
                };
                readonly unsubscribeReason: {
                    readonly enum: readonly ["NeverSignedUp", "NotRelevanContent", "DontReceiveThisEmail", "Other"];
                    readonly type: "string";
                };
                readonly unsubscribeReasonText: {
                    readonly type: readonly ["string", "null"];
                };
            };
            readonly additionalProperties: false;
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly success: {
                    readonly type: "boolean";
                };
                readonly errors: {
                    readonly type: readonly ["array", "null"];
                    readonly items: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                };
                readonly ids: {
                    readonly type: readonly ["array", "null"];
                    readonly items: {
                        readonly type: "string";
                        readonly format: "uuid";
                    };
                };
            };
            readonly additionalProperties: false;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly success: {
                    readonly type: "boolean";
                };
                readonly errors: {
                    readonly type: readonly ["array", "null"];
                    readonly items: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                };
                readonly ids: {
                    readonly type: readonly ["array", "null"];
                    readonly items: {
                        readonly type: "string";
                        readonly format: "uuid";
                    };
                };
            };
            readonly additionalProperties: false;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostV3EntitiesReceiptCreate: {
    readonly body: {
        readonly required: readonly ["action", "branch", "businessId", "createdDate", "items", "payments", "pos", "receiptType", "total", "totalNoVat", "vat", "vatTotal"];
        readonly type: "object";
        readonly properties: {
            readonly userDetails: {
                readonly type: "object";
                readonly properties: {
                    readonly firstName: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly lastName: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly email: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly address: {
                        readonly type: readonly ["string", "null"];
                    };
                };
                readonly additionalProperties: false;
            };
            readonly total: {
                readonly type: "number";
                readonly description: "Receipt total";
                readonly format: "double";
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly totalNoVat: {
                readonly type: "number";
                readonly description: "Receipt total without Vat";
                readonly format: "double";
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly vatTotal: {
                readonly type: "number";
                readonly description: "Vat total";
                readonly format: "double";
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly vat: {
                readonly type: "number";
                readonly description: "Vat %";
                readonly format: "double";
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly currency: {
                readonly type: readonly ["string", "null"];
            };
            readonly discount: {
                readonly type: readonly ["string", "null"];
            };
            readonly barcode: {
                readonly type: readonly ["string", "null"];
            };
            readonly transactionNumber: {
                readonly type: readonly ["string", "null"];
                readonly description: "Transaction Number";
            };
            readonly receiptType: {
                readonly enum: readonly ["Unknown", "Purchase", "Refund", "Replacement", "Cancellation", "Gift", "PurchaseCopy", "Invoice", "Report", "Order", "PriceOffer", "Temporary", "PurchaseInvoice", "GreetingCard"];
                readonly type: "string";
            };
            readonly createdDate: {
                readonly type: "string";
                readonly description: "Timestamp of sale";
                readonly format: "date-time";
            };
            readonly action: {
                readonly enum: readonly ["None", "Send", "SendNPrint", "Print"];
                readonly type: "string";
            };
            readonly target: {
                readonly type: readonly ["string", "null"];
                readonly description: "Mobile number / Email. Required in case Action is 'Send'(1) or 'SendNPrint'(2)";
            };
            readonly additionalTargets: {
                readonly type: readonly ["array", "null"];
                readonly items: {
                    readonly type: "string";
                };
            };
            readonly businessId: {
                readonly type: "string";
                readonly description: "UUID of the Business";
                readonly format: "uuid";
            };
            readonly loyaltyId: {
                readonly type: readonly ["string", "null"];
            };
            readonly loyalName: {
                readonly type: readonly ["string", "null"];
            };
            readonly cashierName: {
                readonly type: readonly ["string", "null"];
            };
            readonly items: {
                readonly type: "array";
                readonly items: {
                    readonly required: readonly ["name", "position", "price", "quantity"];
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly description: "Item description on the receipt";
                        };
                        readonly itemCode: {
                            readonly type: readonly ["string", "null"];
                            readonly description: "Item description on the receipt";
                        };
                        readonly position: {
                            readonly type: "string";
                            readonly description: "Describing the hierarchical elements, such as a pizza combo with multiple layers of customization";
                        };
                        readonly price: {
                            readonly type: "number";
                            readonly description: "The single item  price unit";
                            readonly format: "double";
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly quantity: {
                            readonly type: "number";
                            readonly description: "The amount of items for the row";
                            readonly format: "double";
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly total: {
                            readonly type: readonly ["number", "null"];
                            readonly description: "The full item price unit";
                            readonly format: "double";
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly additionalData: {
                            readonly type: readonly ["array", "null"];
                            readonly items: {
                                readonly required: readonly ["key"];
                                readonly type: "object";
                                readonly properties: {
                                    readonly key: {
                                        readonly type: "string";
                                    };
                                    readonly value: {
                                        readonly type: readonly ["string", "null"];
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                    };
                    readonly additionalProperties: false;
                };
            };
            readonly additionalData: {
                readonly type: readonly ["array", "null"];
                readonly items: {
                    readonly required: readonly ["key"];
                    readonly type: "object";
                    readonly properties: {
                        readonly key: {
                            readonly type: "string";
                        };
                        readonly value: {
                            readonly type: readonly ["string", "null"];
                        };
                    };
                    readonly additionalProperties: false;
                };
            };
            readonly payments: {
                readonly type: "array";
                readonly items: {
                    readonly required: readonly ["amount", "name"];
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly description: "Payment short description";
                        };
                        readonly paymentCode: {
                            readonly type: readonly ["string", "null"];
                        };
                        readonly amount: {
                            readonly type: "number";
                            readonly description: "Payment amount (prefered with vat)";
                            readonly format: "double";
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly paymentInfo: {
                            readonly type: readonly ["string", "null"];
                            readonly description: "Additional info";
                        };
                        readonly lastDigits: {
                            readonly type: readonly ["string", "null"];
                            readonly description: "Additional info";
                        };
                        readonly uid: {
                            readonly type: readonly ["string", "null"];
                            readonly description: "Additional info";
                        };
                        readonly rrn: {
                            readonly type: readonly ["string", "null"];
                            readonly description: "Additional info";
                        };
                        readonly additionalData: {
                            readonly type: readonly ["array", "null"];
                            readonly items: {
                                readonly required: readonly ["key"];
                                readonly type: "object";
                                readonly properties: {
                                    readonly key: {
                                        readonly type: "string";
                                    };
                                    readonly value: {
                                        readonly type: readonly ["string", "null"];
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                    };
                    readonly additionalProperties: false;
                };
            };
            readonly moneySaved: {
                readonly type: readonly ["number", "null"];
                readonly format: "double";
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly orderId: {
                readonly type: readonly ["string", "null"];
            };
            readonly suppressSms: {
                readonly type: "boolean";
            };
            readonly pos: {
                readonly required: readonly ["description", "internalId", "isOnline"];
                readonly type: "object";
                readonly properties: {
                    readonly internalId: {
                        readonly type: "string";
                        readonly description: "Internal Number";
                    };
                    readonly description: {
                        readonly type: "string";
                        readonly description: "Display Name";
                    };
                    readonly isOnline: {
                        readonly type: "boolean";
                        readonly description: "Is Online Purchase";
                    };
                };
                readonly additionalProperties: false;
            };
            readonly branch: {
                readonly required: readonly ["branchAddress", "branchName", "internalId", "isOnline", "language"];
                readonly type: "object";
                readonly properties: {
                    readonly internalId: {
                        readonly type: "string";
                        readonly description: "Internal Number";
                    };
                    readonly language: {
                        readonly enum: readonly ["EN", "HE", "RU", "RO", "PT", "UK", "EL", "FL", "DE", "FR", "AR", "IT", "ES", "BR", "EG", "TH"];
                        readonly type: "string";
                    };
                    readonly companyId: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly branchName: {
                        readonly type: "string";
                        readonly description: "Branch name";
                    };
                    readonly branchAddress: {
                        readonly type: "string";
                        readonly description: "Branch Address";
                    };
                    readonly branchPhone: {
                        readonly type: readonly ["string", "null"];
                        readonly description: "Branch Phone";
                    };
                    readonly description: {
                        readonly type: readonly ["string", "null"];
                        readonly description: "Text";
                    };
                    readonly isOnline: {
                        readonly type: "boolean";
                        readonly description: "Is Online Purchase";
                    };
                    readonly franchiseeName: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly vatNumber: {
                        readonly type: readonly ["string", "null"];
                    };
                };
                readonly additionalProperties: false;
            };
        };
        readonly additionalProperties: false;
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly isReturnDigitalLink: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly receiptId: {
                    readonly type: readonly ["string", "null"];
                };
                readonly receiptUrl: {
                    readonly type: readonly ["string", "null"];
                };
            };
            readonly additionalProperties: false;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostV3EntitiesReceiptCreatewithpdf: {
    readonly body: {
        readonly required: readonly ["action", "branch", "businessId", "createdDate", "items", "payments", "pdfBase64", "pos", "receiptType", "total", "totalNoVat", "vat", "vatTotal"];
        readonly type: "object";
        readonly properties: {
            readonly userDetails: {
                readonly type: "object";
                readonly properties: {
                    readonly firstName: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly lastName: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly email: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly address: {
                        readonly type: readonly ["string", "null"];
                    };
                };
                readonly additionalProperties: false;
            };
            readonly total: {
                readonly type: "number";
                readonly description: "Receipt total";
                readonly format: "double";
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly totalNoVat: {
                readonly type: "number";
                readonly description: "Receipt total without Vat";
                readonly format: "double";
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly vatTotal: {
                readonly type: "number";
                readonly description: "Vat total";
                readonly format: "double";
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly vat: {
                readonly type: "number";
                readonly description: "Vat %";
                readonly format: "double";
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly currency: {
                readonly type: readonly ["string", "null"];
            };
            readonly discount: {
                readonly type: readonly ["string", "null"];
            };
            readonly barcode: {
                readonly type: readonly ["string", "null"];
            };
            readonly transactionNumber: {
                readonly type: readonly ["string", "null"];
                readonly description: "Transaction Number";
            };
            readonly receiptType: {
                readonly enum: readonly ["Unknown", "Purchase", "Refund", "Replacement", "Cancellation", "Gift", "PurchaseCopy", "Invoice", "Report", "Order", "PriceOffer", "Temporary", "PurchaseInvoice", "GreetingCard"];
                readonly type: "string";
            };
            readonly createdDate: {
                readonly type: "string";
                readonly description: "Timestamp of sale";
                readonly format: "date-time";
            };
            readonly action: {
                readonly enum: readonly ["None", "Send", "SendNPrint", "Print"];
                readonly type: "string";
            };
            readonly target: {
                readonly type: readonly ["string", "null"];
                readonly description: "Mobile number / Email. Required in case Action is 'Send'(1) or 'SendNPrint'(2)";
            };
            readonly additionalTargets: {
                readonly type: readonly ["array", "null"];
                readonly items: {
                    readonly type: "string";
                };
            };
            readonly businessId: {
                readonly type: "string";
                readonly description: "UUID of the Business";
                readonly format: "uuid";
            };
            readonly loyaltyId: {
                readonly type: readonly ["string", "null"];
            };
            readonly loyalName: {
                readonly type: readonly ["string", "null"];
            };
            readonly cashierName: {
                readonly type: readonly ["string", "null"];
            };
            readonly items: {
                readonly type: "array";
                readonly items: {
                    readonly required: readonly ["name", "position", "price", "quantity"];
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly description: "Item description on the receipt";
                        };
                        readonly itemCode: {
                            readonly type: readonly ["string", "null"];
                            readonly description: "Item description on the receipt";
                        };
                        readonly position: {
                            readonly type: "string";
                            readonly description: "Describing the hierarchical elements, such as a pizza combo with multiple layers of customization";
                        };
                        readonly price: {
                            readonly type: "number";
                            readonly description: "The single item  price unit";
                            readonly format: "double";
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly quantity: {
                            readonly type: "number";
                            readonly description: "The amount of items for the row";
                            readonly format: "double";
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly total: {
                            readonly type: readonly ["number", "null"];
                            readonly description: "The full item price unit";
                            readonly format: "double";
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly additionalData: {
                            readonly type: readonly ["array", "null"];
                            readonly items: {
                                readonly required: readonly ["key"];
                                readonly type: "object";
                                readonly properties: {
                                    readonly key: {
                                        readonly type: "string";
                                    };
                                    readonly value: {
                                        readonly type: readonly ["string", "null"];
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                    };
                    readonly additionalProperties: false;
                };
            };
            readonly additionalData: {
                readonly type: readonly ["array", "null"];
                readonly items: {
                    readonly required: readonly ["key"];
                    readonly type: "object";
                    readonly properties: {
                        readonly key: {
                            readonly type: "string";
                        };
                        readonly value: {
                            readonly type: readonly ["string", "null"];
                        };
                    };
                    readonly additionalProperties: false;
                };
            };
            readonly payments: {
                readonly type: "array";
                readonly items: {
                    readonly required: readonly ["amount", "name"];
                    readonly type: "object";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly description: "Payment short description";
                        };
                        readonly paymentCode: {
                            readonly type: readonly ["string", "null"];
                        };
                        readonly amount: {
                            readonly type: "number";
                            readonly description: "Payment amount (prefered with vat)";
                            readonly format: "double";
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly paymentInfo: {
                            readonly type: readonly ["string", "null"];
                            readonly description: "Additional info";
                        };
                        readonly lastDigits: {
                            readonly type: readonly ["string", "null"];
                            readonly description: "Additional info";
                        };
                        readonly uid: {
                            readonly type: readonly ["string", "null"];
                            readonly description: "Additional info";
                        };
                        readonly rrn: {
                            readonly type: readonly ["string", "null"];
                            readonly description: "Additional info";
                        };
                        readonly additionalData: {
                            readonly type: readonly ["array", "null"];
                            readonly items: {
                                readonly required: readonly ["key"];
                                readonly type: "object";
                                readonly properties: {
                                    readonly key: {
                                        readonly type: "string";
                                    };
                                    readonly value: {
                                        readonly type: readonly ["string", "null"];
                                    };
                                };
                                readonly additionalProperties: false;
                            };
                        };
                    };
                    readonly additionalProperties: false;
                };
            };
            readonly moneySaved: {
                readonly type: readonly ["number", "null"];
                readonly format: "double";
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly orderId: {
                readonly type: readonly ["string", "null"];
            };
            readonly suppressSms: {
                readonly type: "boolean";
            };
            readonly pos: {
                readonly required: readonly ["description", "internalId", "isOnline"];
                readonly type: "object";
                readonly properties: {
                    readonly internalId: {
                        readonly type: "string";
                        readonly description: "Internal Number";
                    };
                    readonly description: {
                        readonly type: "string";
                        readonly description: "Display Name";
                    };
                    readonly isOnline: {
                        readonly type: "boolean";
                        readonly description: "Is Online Purchase";
                    };
                };
                readonly additionalProperties: false;
            };
            readonly branch: {
                readonly required: readonly ["branchAddress", "branchName", "internalId", "isOnline", "language"];
                readonly type: "object";
                readonly properties: {
                    readonly internalId: {
                        readonly type: "string";
                        readonly description: "Internal Number";
                    };
                    readonly language: {
                        readonly enum: readonly ["EN", "HE", "RU", "RO", "PT", "UK", "EL", "FL", "DE", "FR", "AR", "IT", "ES", "BR", "EG", "TH"];
                        readonly type: "string";
                    };
                    readonly companyId: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly branchName: {
                        readonly type: "string";
                        readonly description: "Branch name";
                    };
                    readonly branchAddress: {
                        readonly type: "string";
                        readonly description: "Branch Address";
                    };
                    readonly branchPhone: {
                        readonly type: readonly ["string", "null"];
                        readonly description: "Branch Phone";
                    };
                    readonly description: {
                        readonly type: readonly ["string", "null"];
                        readonly description: "Text";
                    };
                    readonly isOnline: {
                        readonly type: "boolean";
                        readonly description: "Is Online Purchase";
                    };
                    readonly franchiseeName: {
                        readonly type: readonly ["string", "null"];
                    };
                    readonly vatNumber: {
                        readonly type: readonly ["string", "null"];
                    };
                };
                readonly additionalProperties: false;
            };
            readonly pdfBase64: {
                readonly type: "string";
                readonly description: "PDF in Base64-encoded format";
            };
        };
        readonly additionalProperties: false;
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly isReturnDigitalLink: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly signPdf: {
                    readonly type: "boolean";
                    readonly default: false;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly receiptId: {
                    readonly type: readonly ["string", "null"];
                };
                readonly receiptUrl: {
                    readonly type: readonly ["string", "null"];
                };
                readonly pdfUrl: {
                    readonly type: readonly ["string", "null"];
                };
            };
            readonly additionalProperties: false;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostV3ExternalSendemail: {
    readonly body: {
        readonly required: readonly ["message", "subjectLine", "target"];
        readonly type: "object";
        readonly properties: {
            readonly target: {
                readonly type: "string";
                readonly description: "Email";
            };
            readonly message: {
                readonly type: "string";
                readonly description: "The email content";
            };
            readonly subjectLine: {
                readonly maxLength: 70;
                readonly minLength: 1;
                readonly type: "string";
                readonly description: "1-70 chars";
            };
            readonly senderName: {
                readonly type: readonly ["string", "null"];
                readonly description: "If sender name is empty, take default business sender name from API key";
            };
        };
        readonly additionalProperties: false;
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: readonly ["string", "null"];
                };
                readonly id: {
                    readonly type: "string";
                    readonly format: "uuid";
                };
            };
            readonly additionalProperties: false;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostV3ExternalSendsms: {
    readonly body: {
        readonly required: readonly ["message", "target"];
        readonly type: "object";
        readonly properties: {
            readonly target: {
                readonly type: "string";
                readonly description: "Phone number";
            };
            readonly message: {
                readonly type: "string";
                readonly description: "The SMS content";
            };
            readonly senderName: {
                readonly pattern: "([^-\\s][&A-Za-z0-9]{2,10}$|\\+\\d+)";
                readonly type: readonly ["string", "null"];
                readonly description: "3-11 English chars. If sender name is empty, take default business sender name from API key";
            };
        };
        readonly additionalProperties: false;
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: readonly ["string", "null"];
                };
            };
            readonly additionalProperties: false;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "string";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { GetApiUnsubscribeList, PostApiContactsCreateorupdate, PostApiContactsGetcontactstatus, PostApiUnsubscribe, PostV3EntitiesReceiptCreate, PostV3EntitiesReceiptCreatewithpdf, PostV3ExternalSendemail, PostV3ExternalSendsms };

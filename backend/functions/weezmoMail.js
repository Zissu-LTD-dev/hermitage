// process.env.WEEZMO_KEY
const sdk = require("@api/weezmo");
sdk.auth(process.env.WEEZMO_KEY);

const weezmoMail = async (data) => {
  let { target, message, subjectLine, senderName } = data;
  try {
    return sdk.postV3ExternalSendemail({
        target: target,
        message: message,
        subjectLine: subjectLine,
        senderName: senderName,
      })
      .then(({ data }) => {
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = weezmoMail;

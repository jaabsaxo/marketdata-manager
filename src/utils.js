

const utf8Decoder = new window.TextDecoder();

export default function parseMessageFrame(data) {
    const message = new DataView(data);
    const parsedMessages = [];
    let index = 0;
    let messageId;
    let referenceIdSize;
    let referenceIdBuffer;
    let referenceId;
    let payloadFormat;
    let payloadSize;
    let payloadBuffer;
    let payload;
    while (index < data.byteLength) {
        /* Message identifier (8 bytes)
            * 64-bit little-endian unsigned integer identifying the message.
            * The message identifier is used by clients when reconnecting. It may not be a sequence number and no interpretation
            * of its meaning should be attempted at the client.
            */
        messageId = fromBytesLe(new window.Uint8Array(data, index, 8));
        index += 8;
        /* Version number (2 bytes)
        * Ignored in this example. Get it using 'messageEnvelopeVersion = message.getInt16(index)'.
        */
        index += 2;
        /* Reference id size 'Srefid' (1 byte)
            * The number of characters/bytes in the reference id that follows.
            */
        referenceIdSize = message.getInt8(index);
        index += 1;
        /* Reference id (Srefid bytes)
            * ASCII encoded reference id for identifying the subscription associated with the message.
            * The reference id identifies the source subscription, or type of control message (like '_heartbeat').
            */
        referenceIdBuffer = new window.Int8Array(data, index, referenceIdSize);
        referenceId = String.fromCharCode.apply(String, referenceIdBuffer);
        index += referenceIdSize;
        /* Payload format (1 byte)
            * 8-bit unsigned integer identifying the format of the message payload. Currently the following formats are defined:
            *  0: The payload is a UTF-8 encoded text string containing JSON.
            *  1: The payload is a binary protobuffer message.
            * The format is selected when the client sets up a streaming subscription so the streaming connection may deliver a mixture of message format.
            * Control messages such as subscription resets are not bound to a specific subscription and are always sent in JSON format.
            */
        payloadFormat = message.getUint8(index);
        index += 1;
        /* Payload size 'Spayload' (4 bytes)
            * 64-bit little-endian unsigned integer indicating the size of the message payload.
            */
        payloadSize = message.getUint32(index, true);
        index += 4;
        /* Payload (Spayload bytes)
            * Binary message payload with the size indicated by the payload size field.
            * The interpretation of the payload depends on the message format field.
            */
        payloadBuffer = new window.Uint8Array(data, index, payloadSize);
        payload = null;
        switch (payloadFormat) {
        case 0:
            // JSON
            try {
                payload = JSON.parse(utf8Decoder.decode(payloadBuffer));
            } catch (error) {
                console.error(error);
            }
            break;
        case 1:
            // ProtoBuf is not supported in this example. See the realtime-quotes example for a Protocol Buffers implementation.
            console.error("Protocol Buffers are not supported in this example.");
            break;
        default:
            console.error("Unsupported payloadFormat: " + payloadFormat);
        }
        if (payload !== null) {
            parsedMessages.push({
                "messageId": messageId,
                "referenceId": referenceId,
                "payload": payload
            });
        }
        index += payloadSize;
    }
    return parsedMessages;
}


function fromBytesLe(bytes, unsigned) {
  const low = (bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24) | 0;
  const high = (bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24) | 0;
  const twoPwr16Dbl = 1 << 16;
  const twoPwr32Dbl = twoPwr16Dbl * twoPwr16Dbl;
  if (unsigned) {
      return (high >>> 0) * twoPwr32Dbl + (low >>> 0);
  }
  return high * twoPwr32Dbl + (low >>> 0);
}
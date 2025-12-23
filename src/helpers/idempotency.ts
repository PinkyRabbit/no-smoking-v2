import { DialogKey, IdempotencyKeys } from "../constants";

export const getNextIdempotencyKey = (
  currentKey: IdempotencyKeys,
  hasForgotButton?: boolean,
): {
  idempotencyKey: IdempotencyKeys;
  ImSmokingDialogKey: DialogKey;
} => {
  switch (currentKey) {
    case IdempotencyKeys.One:
      return {
        idempotencyKey: IdempotencyKeys.Two,
        ImSmokingDialogKey: hasForgotButton ? DialogKey.im_smoking_init_2 : DialogKey.im_smoking_2 ,
      };
    case IdempotencyKeys.Two:
      return {
        idempotencyKey: IdempotencyKeys.Three,
        ImSmokingDialogKey: hasForgotButton ? DialogKey.im_smoking_init_3 : DialogKey.im_smoking_3 ,
      };
    case IdempotencyKeys.Three:
    default:
      return {
        idempotencyKey: IdempotencyKeys.One,
        ImSmokingDialogKey: hasForgotButton ? DialogKey.im_smoking_init_1 : DialogKey.im_smoking_1 ,
      };
  }
};

export const smokingButtonByIdempotencyKey = (key: IdempotencyKeys): DialogKey => {
  switch (key) {
    case IdempotencyKeys.One:
      return DialogKey.im_smoking_1;
    case IdempotencyKeys.Two:
      return DialogKey.im_smoking_2;
    case IdempotencyKeys.Three:
    default:
      return DialogKey.im_smoking_3;
  }
};
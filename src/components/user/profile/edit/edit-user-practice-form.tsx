import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { HStack, Flex, VStack, useToast, Text } from '@chakra-ui/react';
import { FormSubmitButton } from '@components/forms/form-submit-button';
import { FormCancelButton } from '@components/forms/form-cancel-button';
import { FormCheckboxInput } from '@components/ui/forms/form-checkbox-input';
import FormSliderInput from '@components/ui/forms/form-slider-input';
import { roundTo2 } from '@modules/core/math/math';
import { useRouter } from 'next/router';
import { UserSettingsFragment, useUpdateUserMutation, useUpdateUserSettingsMutation } from '@generated/graphql';

interface EditUserPracticeFormProps {
  /** Callback function to call when cancel button is clicked */
  onCancelCallback: () => void;
  userId: string;
  userSettings: UserSettingsFragment;
}

export const EditPracticeFormSchema = Yup.object().shape({
  blindMode: Yup.boolean().required('Blind Mode is required!'),
  pauseOnError: Yup.boolean().required('Pause on Error is required!'),
  noBackspace: Yup.boolean().required('No Backspace is required!'),
  typeSounds: Yup.boolean().required('Type Sounds is required!'),
  typeSoundsVolume: Yup.number()
    .min(0.1, 'Volume must be greater than 0.1')
    .max(5, 'Volume must be lower than 5')
    .required('Volume is required'),
});

export interface EditUserPracticeFormValues {
  blindMode: boolean;
  pauseOnError: boolean;
  noBackspace: boolean;
  typeSounds: boolean;
  typeSoundsVolume: number;
}

export const EditUserPracticeForm: React.FC<EditUserPracticeFormProps> = ({
  userSettings,
  userId,
  onCancelCallback,
}) => {
  const toast = useToast();
  const router = useRouter();
  const [updateUserSettings] = useUpdateUserSettingsMutation();
  const [typeSoundValue, setTypeSoundValue] = useState(userSettings.typeSoundsVolume);
  const initialFormValues: EditUserPracticeFormValues = {
    blindMode: userSettings.blindMode,
    noBackspace: userSettings.noBackspace,
    pauseOnError: userSettings.pauseOnError,
    typeSounds: userSettings.typeSounds,
    typeSoundsVolume: userSettings.typeSoundsVolume,
  };

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={EditPracticeFormSchema}
      onSubmit={async (values) => {
        const response = await updateUserSettings({
          variables: { input: { ...values, userId } },
        });
        if (response?.data?.updateUserSettings?.errors?.length > 0) {
          toast({
            title: 'An error occurred',
            description: response.data.updateUserSettings.errors[0].message,
            duration: 3000,
            status: 'error',
            position: 'bottom-right',
          });
        }
        toast({
          title: 'Success',
          description: 'Practice settings saved successfully!',
          duration: 3000,
          status: 'success',
          position: 'bottom-right',
        });
        router.push(`/user/${router.query.name}`);
      }}
    >
      {(props: FormikProps<EditUserPracticeFormValues>) => {
        const { handleSubmit } = props;
        return (
          <Flex as="form" flexDir="column" maxWidth="100%" my={4} px={2} onSubmit={handleSubmit as any}>
            {/* Form Content */}
            <VStack alignItems="flex-start" mb={4}>
              <Text as="h2" fontSize="3xl" fontWeight={600}>
                Practice Settings
              </Text>

              {/* Blind Mode Input */}
              <VStack>
                <Text as="p" fontSize="md" fontWeight={400}>
                  Enable or disable all the error colors, and focus on base speed.
                </Text>
                <FormCheckboxInput name="blindMode" sx={{ margin: '0.25rem !important' }}>
                  Blind Mode
                </FormCheckboxInput>
              </VStack>

              {/* Pause on Error Input */}
              <VStack>
                <Text as="p" fontSize="md" fontWeight={400}>
                  Enable or disable pause on error when a character is typed wrong.
                </Text>
                <FormCheckboxInput name="pauseOnError" sx={{ margin: '0.25rem !important' }}>
                  Pause on Error
                </FormCheckboxInput>
              </VStack>

              {/* No Backspace Input */}
              <VStack>
                <Text as="p" fontSize="md" fontWeight={400}>
                  If enabled, user will not be able to delete characters.
                </Text>
                <FormCheckboxInput name="noBackspace" sx={{ margin: '0.25rem !important' }}>
                  No Backspace
                </FormCheckboxInput>
              </VStack>

              {/* Type Sounds Input */}
              <VStack>
                <Text as="p" fontSize="md" fontWeight={400}>
                  If enabled, a keypress sound will be played on key press.
                </Text>
                <FormCheckboxInput name="typeSounds" sx={{ margin: '0.25rem !important' }}>
                  Type Sound
                </FormCheckboxInput>
              </VStack>

              {/* Type Sounds Volume Input */}
              <VStack>
                <Text as="p" fontSize="md" fontWeight={400}>
                  Controls the volume of the type sounds in a scale 0.1 to 5
                </Text>
                <HStack width="100%">
                  <FormSliderInput
                    name="typeSoundsVolume"
                    sliderProps={{
                      min: 0.1,
                      step: 0.0001,
                      max: 5,
                      value: initialFormValues.typeSoundsVolume,
                      onChangeStart: (value) => setTypeSoundValue(value),
                    }}
                    sx={{ margin: '0.25rem !important' }}
                  >
                    Type Sound Volume
                  </FormSliderInput>
                  <Text as="p" fontSize="md" fontWeight={400}>
                    {roundTo2(typeSoundValue)}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
            {/* Submit Form */}
            <HStack>
              {/* Submit button */}
              <FormSubmitButton width="50%">Save Changes</FormSubmitButton>
              <FormCancelButton width="50%" onClick={onCancelCallback}>
                Cancel
              </FormCancelButton>
            </HStack>
          </Flex>
        );
      }}
    </Formik>
  );
};

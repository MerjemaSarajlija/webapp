import { FC } from 'react';

import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Button,
  Container,
  FormControl,
  Heading,
  Input,
  Stack,
  Textarea,
  FormErrorMessage,
  IconButton,
  Box,
  useToast,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useBookAppointmentMutation } from '@/generated/core.graphql';
import { Slot } from '@/types/domain';

type Props = {
  selectedSlot: Slot;
  goBack(): void;
  onClose(): void;
};

interface IFormInput {
  patientName: string;
  description: string;
}

export const BookApp: FC<Props> = ({
  selectedSlot,
  goBack,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  console.log(selectedSlot)

  const [bookAppointment, { loading }] = useBookAppointmentMutation();
  const toast = useToast();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    
    try {
      await bookAppointment({
        variables: {
          bookAppointmentInput: {
            slot: {
              doctorId: selectedSlot.doctorId,
              end: selectedSlot.end,
              start: selectedSlot.start,
            },
            patientName: data.patientName,
            description: data.description,
          },
        },
      });
      toast({
        title: 'Appointment booked successfully',
        status: 'success',
        isClosable: true,
        position: 'top',
      });
      onClose();
    } catch (err: any) {
      toast({
        title: err?.graphQLErrors[0]?.message,
        status: 'error',
        position: 'top',
      });
    }
  };

  return (
    <Container padding={8}>
      <Heading
        size='md'
        mb={4}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <IconButton
          aria-label='slot-selector'
          icon={<ArrowBackIcon />}
          variant='outline'
          border='0px'
          borderRadius='100%'
          onClick={goBack}
        />
        Create Appointment
        <div />
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors?.patientName?.message}>
            <Input
              placeholder='Patient Name'
              {...register('patientName', {
                required: 'Patient name is required',
                minLength: { value: 3, message: 'Minimum 3 characters' },
              })}
            />
            <FormErrorMessage>
              {errors?.patientName && errors?.patientName?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors?.description?.message}>
            <Textarea
              placeholder='Description'
              {...register('description', {
                required: 'Description is required',
              })}
            />
            <FormErrorMessage>
              {errors?.description && errors?.description?.message}
            </FormErrorMessage>
          </FormControl>

          <Button colorScheme='teal' type='submit' isLoading={loading}>
            Create
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

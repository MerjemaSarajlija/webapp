import { useEffect, useState } from 'react';
import { format } from "date-fns";


import { Heading, Box, Text } from '@chakra-ui/react';
import { addMinutes, addDays } from 'date-fns';

import DoctorSelector from '@/components/DoctorSelector';
import SlotSelector from '@/components/SlotSelector';
import { BookApp } from '@/components/SlotSelector/BookApp';
import {
  Doctor,
  Slot,
  useDoctorsQuery,
  useSlotsQuery,
} from '@/generated/core.graphql';
import { SlotWithKey } from '@/types/domain';
import moment from 'moment';

const minStartDate = moment(new Date());
const maxStartDate = moment(addDays(new Date(), 6));

const startDate = new Date();
const generateSlots = (): SlotWithKey[] => {
  return [
    {
      key: startDate.toString(),
      start: startDate,
      end: addMinutes(startDate, 15),
      doctorId: 1,
    },
  ];
};

const Appointments = () => {
  const { data, loading } = useDoctorsQuery();
  const [error, setError] = useState<string>();
  const [slots, setSlots] = useState<SlotWithKey[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  const [isLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState();
  const [slotIsChanged, setSlotIsChanged] = useState(false);
  

  const SLOTS = useSlotsQuery({
    variables: {
      from: minStartDate,
      to: maxStartDate,
    },
  });



  const allSlots = SLOTS?.data?.slots;

  const getSlotsByDoctorId = (doctorId: any) => {
    const filteredSlots = allSlots?.filter((item) => item.doctorId == doctorId);
    return filteredSlots ?? [];
  };

 

  useEffect(() => {
    if (selectedSlot != {}) {
      setSlotIsChanged(true);
    } else {
      setSlotIsChanged(false);
    }
  }, [selectedSlot]);

  useEffect(() => {
    if (selectedDoctor) {
      // fetch availabilities
      // generate slots
      const slots = generateSlots();
      setSlots(slots);
    } else {
      setSlots([]);
    }
  }, [selectedDoctor]);

  const backToSlotSelector = () => {
    setSelectedSlot(undefined);
  };

  const onClose = () => {
    setSelectedSlot(undefined);
  };

  return (
    <Box>
      <Heading>Appointments</Heading>
      {error && (
        <Box>
          <Text>{error}</Text>
        </Box>
      )}
      <DoctorSelector
        doctors={data?.doctors as Doctor[]}
        value={selectedDoctor}
        onChange={setSelectedDoctor}
      />
      {slots?.length > 0 ? (
        <>
          {!selectedSlot && (
            <SlotSelector
             // minimumStartDate={minimumStartDate}
              //maximumStartDate={maximumStartDate}
              availableSlots={getSlotsByDoctorId(selectedDoctor?.id)}
              value={selectedSlot}
              onChange={setSelectedSlot}
              loadingSlots={isLoading}
            />
          )}
          {selectedSlot && (
            <BookApp
              selectedSlot={selectedSlot}
              goBack={backToSlotSelector}
              onClose={onClose}
            />
          )}
        </>
      ) : (
        <Text></Text>
      )}
    </Box>
  );
};

export default Appointments;

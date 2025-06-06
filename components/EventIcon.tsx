import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import EventEditor from "./EventEditor";

type Props = {
  id: string;
  title: string;
  date: string;
  description: string;
  images?: string[];
  onUpdateEvent: (updatedEvent: {
    id: string;
    title: string;
    date: string;
    description: string;
    images: string[];
  }) => void;
  onDeleteEvent: () => void;
};

export default function EventIcon({
  id,
  title,
  date,
  description,
  images = [],
  onUpdateEvent,
  onDeleteEvent,
}: Props) {
  const scale = useSharedValue(1);
  const deleteOpacity = useSharedValue(0);
  const deleteScale = useSharedValue(0.9);
  const overlayOpacity = useSharedValue(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const eventDetails = { title, date, description, images };

  // const handleLongPress = () => {
  //   overlayOpacity.value = withTiming(0.5, { duration: 200 });
  //   scale.value = withTiming(1.05, { duration: 150 });
  //   deleteOpacity.value = withTiming(1, { duration: 200 });
  //   deleteScale.value = withTiming(1, { duration: 200 });
  //   setShowDelete(true);
  // };

  // const handlePressOut = () => {
  //   scale.value = withTiming(1, { duration: 150 });
  // };

  // const hideDelete = () => {
  //   overlayOpacity.value = withTiming(0, { duration: 200 });
  //   deleteOpacity.value = withTiming(0, { duration: 150 });
  //   deleteScale.value = withTiming(0.9, { duration: 150 }, () => {
  //     runOnJS(setShowDelete)(false);
  //   });
  // };

  // const overlayStyle = useAnimatedStyle(() => ({
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   opacity: overlayOpacity.value,
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   zIndex: 50,
  // }));

  const deleteIconStyle = useAnimatedStyle(() => ({
    opacity: deleteOpacity.value,
    transform: [{ scale: deleteScale.value }],
    position: "absolute",
    top: -30,
    alignSelf: "center",
    zIndex: 100,
  }));

  return (
    <>
      {/* Overlay */}

      {/* Event Icon Container */}
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Delete Icon */}
        {showDelete && (
          <Animated.View style={deleteIconStyle}>
            <Pressable onPress={onDeleteEvent}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </Pressable>
          </Animated.View>
        )}

        {/* Event Content */}
        <Pressable
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dateText}>
            {new Date(eventDetails.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
          <Text style={styles.titleText}>{eventDetails.title}</Text>
        </Pressable>

        {/* Event Editor Modal */}
        <EventEditor
        onDelete={() => {
    setModalVisible(false);
    onDeleteEvent();
  }}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={(newEvent) => {
            const updatedEvent = {
              id,
              title: newEvent.title,
              date: new Date(newEvent.date).toISOString(),
              description: newEvent.description,
              images: [...newEvent.images],
            };
            onUpdateEvent(updatedEvent);
            setModalVisible(false);
          }}
          initialTitle={eventDetails.title}
          initialDate={new Date(eventDetails.date)}
          initialDescription={eventDetails.description}
          initialImages={eventDetails.images}
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "magenta",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  titleText: {
    color: "#1e1e1e",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  dateText: {
    color: "grey",
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
});
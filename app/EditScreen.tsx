import React, { useRef, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import EventEditor from "@/components/EventEditor";
import Timeline from "@/components/Timeline";
import { useNavigation, useRoute } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";

export default function EditScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const scaleValue = useSharedValue(1);
  const inputRef = useRef<TextInput>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState(
    (route.params?.events || []).map((event: any) => ({
      ...event,
      id: event.id ?? uuidv4(),
    }))
  );
  const [timelineTitle, setTimelineTitle] = useState(route.params?.title || "");

  const handleBackButton = () => {
    scaleValue.value = withTiming(0.9, { duration: 100 }, () => {
      scaleValue.value = withTiming(1, { duration: 100 });
    });
    navigation.goBack();
  };

  const handleAddEvent = () => {
    scaleValue.value = withTiming(0.9, { duration: 100 }, () => {
      scaleValue.value = withTiming(1, { duration: 100 });
    });
    setModalVisible(true);
  };

  const handleSaveEvent = (newEvent: {
    title: string;
    date: string;
    description: string;
    images: string[];
  }) => {
    setEvents(
      (
        prevEvents: {
          id: string;
          title: string;
          date: string;
          description: string;
          images: string[];
        }[]
      ) => [
        ...prevEvents,
        {
          ...newEvent,
          id: uuidv4(),
        },
      ]
    );
    setModalVisible(false);
  };

  const handleUpdateEvent = (
    index: number,
    updatedEvent: {
      title: string;
      date: string;
      description: string;
      images: string[];
    }
  ) => {
    setEvents(
      (
        prevEvents: {
          id: string;
          title: string;
          date: string;
          description: string;
          images: string[];
        }[]
      ) => {
        const updatedEvents = [...prevEvents];
        updatedEvents[index] = {
          ...updatedEvents[index], // preserves id
          ...updatedEvent,
        };
        return updatedEvents;
      }
    );
  };

  const handleSaveTimeline = () => {
    if (!timelineTitle.trim()) {
      alert("Please enter a timeline title.");
      return;
    }

    const timelineData = {
      id: route.params?.id ?? uuidv4(),
      title: timelineTitle,
      events,
    };

    navigation.goBack();
    navigation.navigate("Home", { savedTimeline: timelineData });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(
      (
        prevEvents: {
          id: string;
          title: string;
          date: string;
          description: string;
          images: string[];
        }[]
      ) => prevEvents.filter((event) => event.id !== id)
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          ref={inputRef}
          placeholder="Title"
          placeholderTextColor={"grey"}
          value={timelineTitle}
          onChangeText={setTimelineTitle}
        ></TextInput>
        <Pressable
          onPress={handleBackButton}
          style={styles.goBackButtonWrapper}
        >
          <Animated.View
            style={[
              styles.goBackButton,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <Ionicons name="arrow-back-circle" size={30} color="#25292e" />
          </Animated.View>
        </Pressable>
        <Pressable
          onPress={handleAddEvent}
          style={styles.add_event_button_wrapper}
        >
          <Animated.View
            style={[
              styles.add_event_button,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <Text style={styles.new_event_text}>Add Event +</Text>
          </Animated.View>
        </Pressable>

        <Timeline
          events={events}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        ></Timeline>

        <EventEditor
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveEvent}
        ></EventEditor>

        <Pressable
          onPress={handleSaveTimeline}
          style={styles.save_button_wrapper}
        >
          <Animated.View
            style={[styles.save_button, { transform: [{ scale: scaleValue }] }]}
          >
            <Text style={styles.save_button_text}>Save Timeline</Text>
          </Animated.View>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  goBackButtonWrapper: {
    position: "absolute",
    top: 60,
    left: 10,
  },
  goBackButton: {
    marginTop: 4,
    padding: 7.5,
    backgroundColor: "magenta",
    borderRadius: 10,
  },
  input: {
    position: "absolute",
    top: 60,
    textAlign: "center",
    height: 50,
    width: "50%",
    borderColor: "magenta",
    borderWidth: 2,
    borderRadius: 10,
    color: "white",
    fontSize: 20,
    backgroundColor: "#1e1e1e",
    fontFamily: "Futura",
  },
  add_event_button_wrapper: {
    position: "absolute",
    bottom: 650,
    left: 0,
    right: 0,
    alignSelf: "center",
    alignItems: "center",
    width: "50%",
    marginLeft: "25%",
  },
  add_event_button: {
    borderWidth: 2,
    borderColor: "magenta",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 5,
    backgroundColor: "magenta",
    alignItems: "center",
  },
  new_event_text: {
    fontFamily: "Futura",
    color: "#1e1e1e",
    fontSize: 20,
  },
  timeline: {
    position: "absolute",
    top: "50%",
    left: "10%",
    right: "10%",
    height: 5,
    backgroundColor: "white",
  },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  save_button_wrapper: {
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
    width: "50%",
  },
  save_button: {
    borderWidth: 2,
    borderColor: "magenta",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 5,
    backgroundColor: "magenta",
    alignItems: "center",
    marginBottom: 15,
  },
  save_button_text: {
    color: "#1e1e1e",
    fontSize: 20,
    fontFamily: "Futura",
  },
});

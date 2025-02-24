<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import requestGenerator from '../gptRequests';
import useUIInteractor from '../composables/useUIInteraction';
import CarListingForm from './CarListingForm.vue';

const logResponseToUI = false;
const exampleNumber = 'example1';

//#region
const transcript = ref('');
const isRecording = ref(false);
const errorMessage = ref('');
const gptResult = ref();
let recognition = null;

const { response } = useUIInteractor();

onMounted(() => {
  initializeSpeechRecognition();
});

onUnmounted(() => {
  if (recognition) {
    recognition.stop();
  }
});

function initializeSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    errorMessage.value =
      'Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.';
    return;
  }

  recognition = new SpeechRecognition();

  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isRecording.value = true;
    errorMessage.value = '';
  };

  recognition.onend = () => {
    isRecording.value = false;
  };

  recognition.onerror = (event) => {
    isRecording.value = false;
    errorMessage.value = `Error: ${event.error}`;
    console.error('Speech Recognition Error:', event.error);
  };

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    transcript.value = result;
    sendToOpenAI(result);
  };
}

function startRecording() {
  if (!recognition) {
    initializeSpeechRecognition();
  }

  if (recognition && !isRecording.value) {
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      errorMessage.value =
        'Error starting speech recognition. Please try again.';
    }
  }
}

function stopRecording() {
  if (recognition && isRecording.value) {
    recognition.stop();
  }
}
//#endregion

async function sendToOpenAI(text) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const { getRequest, handleRequest } = requestGenerator[exampleNumber]();

  const requestData = getRequest(text);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = (gptResult.value = await res.json());

    handleRequest(data);
  } catch (error) {
    console.error('Error:', error);
    errorMessage.value = 'Error processing your request. Please try again.';
  }
}
</script>

<template>
  <div class="p-4">
    <button
      class="relative p-4 rounded-full transition-all duration-300 hover:bg-gray-100"
      :class="isRecording ? 'text-red-500' : 'text-gray-600'"
      @mousedown="startRecording"
      @mouseup="stopRecording"
      @mouseleave="stopRecording"
    >
      <!-- Microphone icon (SVG) -->
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-8 h-8"
        :class="isRecording ? 'animate-pulse' : ''"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>

      <!-- Recording indicator ring -->
      <div
        v-if="isRecording"
        class="absolute inset-0 rounded-full border-2 border-red-500 animate-ping"
      />
    </button>

    <div v-if="errorMessage" class="mt-4 text-red-500">
      {{ errorMessage }}
    </div>

    <div v-if="transcript" class="mt-4 p-4 bg-gray-100 rounded">
      prompt: "{{ transcript }}"
    </div>

    <div v-if="response" class="mt-4 p-4 bg-gray-100 rounded">
      response: "{{ response }}"
    </div>

    <div v-if="logResponseToUI && gptResult">
      <pre wrap>
        {{ gptResult }}
      </pre>
    </div>

    <div v-if="exampleNumber === 'example4'">
      <CarListingForm />
    </div>
  </div>
</template>

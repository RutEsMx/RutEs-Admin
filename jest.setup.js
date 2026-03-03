import "@testing-library/jest-dom";

// Agregar React globalmente para que esté disponible en todos los componentes
const React = require("react");
global.React = React;

// Mock Firebase
jest.mock("@/firebase/client", () => ({
  auth: {
    currentUser: null,
  },
  db: {},
  app: {},
}));

jest.mock("firebase/auth", () => ({
  fetchSignInMethodsForEmail: jest.fn().mockResolvedValue([]),
  getAuth: jest.fn(() => ({})),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
}));

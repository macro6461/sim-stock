import { render, fireEvent, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChatWindow from "../src/components/ChatWindow"; // Adjust import based on the file structure
import WebSocketWrapper from "../src/components/WebSocketWrapper"; // Mocked component
import React from "react";
import { Close, Chat } from '@mui/icons-material';
import { data } from 'react-router-dom';

// Mock WebSocketWrapper since it's not the focus of this test
jest.mock("../src/components/WebSocketWrapper", () => ({
  __esModule: true,
  default: ({ closeChat }: { closeChat: () => void }) => (
    <div data-testid="websocket-wrapper">
      <button onClick={closeChat}>Close Chat</button>
    </div>
  ),
}));

describe("ChatWindow Component", () => {
  test("renders ForumIcon initially", () => {
    render(<ChatWindow />);
    expect(screen.getByTestId("ForumIcon")).toBeInTheDocument();
  });

  test("opens chat when clicking ForumIcon", () => {
    render(<ChatWindow />);
    
    // Click on the chat icon
    fireEvent.click(screen.getByTestId("ForumIcon"));

    // WebSocketWrapper should appear
    expect(screen.getByTestId("websocket-wrapper")).toBeInTheDocument();
  });

  test("closes chat when clicking 'Close Chat'", () => {
    render(<ChatWindow />);

    // Open chat
    fireEvent.click(screen.getByTestId("ForumIcon"));
    expect(screen.getByTestId("websocket-wrapper")).toBeInTheDocument();

    // Click close chat button
    fireEvent.click(screen.getByText("Close Chat"));

    // WebSocketWrapper should be removed
    expect(screen.queryByTestId("websocket-wrapper")).not.toBeInTheDocument();
  });
});
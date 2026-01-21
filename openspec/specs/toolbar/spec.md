# toolbar Specification

## Purpose

To define the behavior and requirements of the application toolbar, including tool selection and window management controls.

## Requirements

### Requirement: Window Drag Button

The system SHALL provide a button in the top toolbar that allows the user to drag and reposition the main application window.

#### Scenario: Dragging the move button

- **WHEN** the user clicks and holds the drag button in the toolbar
- **AND** changes the cursor position
- **THEN** the main window moves synchronously with the cursor

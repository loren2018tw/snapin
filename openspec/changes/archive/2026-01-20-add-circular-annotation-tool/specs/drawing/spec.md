## ADDED Requirements

### Requirement: Circular Annotation Tool

The drawing application SHALL provide a circular annotation tool that allows users to draw circles by dragging from the center point to define the radius.

#### Scenario: Draw a circle

- **WHEN** the user selects the 'Circle' tool and drags on the canvas from center to edge
- **THEN** a circle is drawn with the start point as center and distance to current point as radius

#### Scenario: Circle persistence

- **WHEN** a circle is drawn
- **THEN** it remains on the canvas until cleared

#### Scenario: Circle styling

- **WHEN** drawing a circle
- **THEN** it uses the configured rectangle color and line width for the stroke

#### Scenario: Circle tool selection

- **WHEN** user clicks the Circle button in the toolbar
- **THEN** the Circle tool is activated for drawing

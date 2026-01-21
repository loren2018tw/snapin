### Requirement: Ellipse Annotation Tool

The drawing application SHALL provide an ellipse annotation tool that allows users to draw ellipses by dragging to define the bounding box.

#### Scenario: Draw an ellipse

- **WHEN** the user selects the 'Ellipse' tool and drags on the canvas
- **THEN** an ellipse is drawn within the bounding box defined by the start and end points

#### Scenario: Ellipse persistence

- **WHEN** an ellipse is drawn
- **THEN** it remains on the canvas until cleared

#### Scenario: Ellipse styling

- **WHEN** drawing an ellipse
- **THEN** it uses the configured rectangle color and line width for the stroke

#### Scenario: Ellipse tool selection

- **WHEN** user clicks the Ellipse button in the toolbar
- **THEN** the Ellipse tool is activated for drawing

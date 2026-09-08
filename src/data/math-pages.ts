import type { MathKind } from '../lib/math-tools';
export const mathPages: Record<
  MathKind,
  {
    title: string;
    description: string;
    answer: string;
    purpose: string;
    steps: string[];
    exampleTitle: string;
    example: string[];
    method: { heading: string; text: string }[];
    faq: { q: string; a: string }[];
    source: { name: string; url: string };
  }
> = {
  'number-line': {
    title: 'Number Line Generator — Fractions, Jumps & Free PDF | ChartsAI',
    description:
      'Make a number line with fractions, negative numbers, equal jumps or open and closed intervals. Explore, practise and download a free PDF worksheet with answers.',
    answer:
      'Create a number line with evenly spaced ticks, plot fractions or negative numbers, show equal jumps, or shade a bounded interval. Preview the result, hide it for practice, and download a printable worksheet with a separate answer key.',
    purpose: 'For locating numbers, explaining addition and subtraction, and learning interval notation.',
    steps: [
      'Choose points, jumps, an interval or a blank number line. Set the minimum, maximum and tick interval.',
      'Enter numbers or fractions such as −2, 0.5 or 1/4. Choose open or closed endpoints when shading an interval.',
      'Explore the completed diagram, or switch to practice and draw your answer on paper. Download a worked page or a worksheet with answers.',
    ],
    exampleTitle: 'Cross zero in five jumps.',
    example: [
      'Start at −2. Five jumps of +1 take you through −1, 0, 1 and 2, ending at 3. The calculation is −2 + 5 × 1 = 3. Each equal jump covers the same physical distance.',
      'Now change the jump size to −1 and start at 3. You travel left and finish at −2. A negative jump changes direction; it does not change the equal spacing of the number line.',
    ],
    method: [
      {
        heading: 'Fractions belong between integers',
        text: 'A step of 1/4 divides each unit into four equal parts. On a line from 0 to 2, there are eight intervals and nine ticks. The point 1/2 falls at the same position as 2/4. Labels use simplified slash fractions with denominators up to 100; other values use decimals rounded to eight significant digits.',
      },
      {
        heading: 'An interval describes a set of values',
        text: 'A filled endpoint includes its value; an open endpoint excludes it. For example, [−2, 3) means −2 ≤ x < 3. The shaded segment includes the values between the endpoints. This version supports one finite interval, with neither endpoint beyond the displayed range.',
      },
      {
        heading: 'Inputs, spacing and exports',
        text: 'Use a range within −50 to 50 and 2–20 equal intervals; the tick step must divide the range exactly. Plot up to eight values, including repeats, or make 1–10 equal jumps. Every value must fit. PDF supports A4 and US Letter. SVG and PNG show the current diagram; CSV retains numeric values. Blank mode keeps numbered ticks for your own activity.',
      },
    ],
    faq: [
      {
        q: 'Can I make a fraction number line?',
        a: 'Yes. Set a fractional tick interval such as 1/2, 1/4 or 1/5, then enter the point values as fractions or decimals. Choose Fraction labels to show simplified fractions where possible.',
      },
      {
        q: 'Can I show subtraction and negative numbers?',
        a: 'Yes. Use a negative jump size to move left, and a range that includes all jumps. For example, start at 3 and make five jumps of −1 to finish at −2.',
      },
      {
        q: 'Can I print just the questions?',
        a: 'Choose Practice mode, select PDF and turn off the separate answer key. The question page keeps the range and instructions but hides the completed points, jumps or shaded interval.',
      },
    ],
    source: {
      name: 'The Math Learning Center: Number Line',
      url: 'https://www.mathlearningcenter.org/apps/number-line',
    },
  },
  slope: {
    title: 'Slope Calculator with Graph — Rise, Run & Worksheet | ChartsAI',
    description:
      'Find slope from two points with a clear graph, rise and run, and a line equation. Use fractions, explore vertical lines and print a free worksheet with answers.',
    answer:
      'Enter two points to calculate slope as change in y divided by change in x. The graph shows the line and a dashed rise-and-run path, while the worked solution gives the arithmetic and equation. Switch to practice to find the answers yourself.',
    purpose: 'For connecting two ordered pairs to rise, run, gradient and the equation of a straight line.',
    steps: [
      'Enter X and Y for point A and point B. Fractions such as 1/2 are accepted. Choose a preset for positive, negative, horizontal or vertical slope.',
      'Follow the dashed path from A across to the X position of B, then vertically to B. Read the signed rise and run together.',
      'Move point B with the slider to explore, or switch to Practice mode. Download the graph or print a worksheet with an optional answer key.',
    ],
    exampleTitle: 'Rise four. Run six. Slope two-thirds.',
    example: [
      'A is (−2, −1) and B is (4, 3). The vertical change is 3 − (−1) = 4. The horizontal change is 4 − (−2) = 6. Therefore the slope is 4/6 = 2/3.',
      'Substitute A into y = mx + b: −1 = (2/3)(−2) + b, so b = 1/3. The equation is y = (2/3)x + 1/3. Both given points lie on that line. Reversing A and B changes both signs and leaves the slope unchanged.',
    ],
    method: [
      {
        heading: 'Keep the subtraction order consistent',
        text: 'For A (x₁, y₁) and B (x₂, y₂), use m = (y₂ − y₁)/(x₂ − x₁). Positive slope rises as you move right; negative slope falls. You can work from B to A instead, provided you reverse both subtractions. Reversing only one gives the wrong sign.',
      },
      {
        heading: 'Horizontal, vertical and repeated points',
        text: 'A horizontal line has rise zero and nonzero run, so its slope is zero. A vertical line has run zero and nonzero rise: its slope is undefined and its equation is x = a constant. Two identical points determine no unique line, so the calculator asks you to change a point.',
      },
      {
        heading: 'What the graph and exports show',
        text: 'Both axes use the same unit scale, and the window includes the two points. The infinite mathematical line is clipped to that window. Inputs must be between −50 and 50. The slider offers half-unit steps from −10 to 10; the text fields allow other supported values. The CSV contains the original two points, and PDF includes the calculation in Explore mode or a question sheet in Practice mode.',
      },
    ],
    faq: [
      {
        q: 'Is gradient the same as slope?',
        a: 'For a straight line in this tool, yes. Both mean the signed change in y divided by the signed change in x. This is a coordinate calculation, not a roof-pitch or land-survey tool.',
      },
      {
        q: 'Why is the slope undefined?',
        a: 'Your points have the same X coordinate and different Y coordinates. The run is zero, so the slope formula would divide by zero. The calculator shows the vertical line equation instead.',
      },
      {
        q: 'Does the CSV contain generated observations?',
        a: 'No. It contains the two points you entered. The line and rise/run path are calculated constructions, not extra measured data.',
      },
    ],
    source: {
      name: 'Calculator.net: slope formula and special cases',
      url: 'https://www.calculator.net/slope-calculator.html',
    },
  },
  transformation: {
    title: 'Geometry Transformation Calculator — Graph & Free Worksheet | ChartsAI',
    description:
      'Translate, reflect, rotate or dilate a polygon on a coordinate grid. See corresponding vertices, hide the image for practice and print a free PDF with answers.',
    answer:
      'Transform a polygon by translation, reflection, rotation or dilation. The calculator plots the original shape and its image on the same equal-scale grid, lists corresponding coordinates, and creates a practice worksheet with a separate answer key.',
    purpose: 'For seeing how a coordinate rule moves every vertex of a triangle or another simple polygon.',
    steps: [
      'Choose a transformation. Enter its shift, reflection line, rotation angle or scale factor and centre.',
      'Keep the sample triangle or paste 3–6 vertices in perimeter order, one labelled X/Y pair per line. The grid expands to include the complete original and image.',
      'Compare the solid blue original with the dashed orange image. In Practice mode, draw the image yourself before revealing it or printing the key.',
    ],
    exampleTitle: 'Move every vertex by the same amount.',
    example: [
      'The original triangle has A (1, 1), B (4, 1) and C (2, 4). Translate it 5 units left and 2 units down: (x, y) → (x − 5, y − 2).',
      'The image is A′ (−4, −1), B′ (−1, −1) and C′ (−3, 2). Each corresponding pair has the same horizontal and vertical change. The triangle keeps its size and shape. The prime mark distinguishes an image vertex from its original.',
    ],
    method: [
      {
        heading: 'Translation and reflection rules',
        text: 'Translation adds the same horizontal and vertical shift to every point. Reflection in the x-axis changes (x, y) to (x, −y); reflection in the y-axis changes it to (−x, y). The diagonal options swap coordinates for y = x, or negate and swap them for y = −x. A dashed reference line identifies the mirror.',
      },
      {
        heading: 'Rotation needs a centre and a direction',
        text: 'About the origin, 90° anticlockwise maps (x, y) to (−y, x); 180° maps it to (−x, −y); and 270° anticlockwise maps it to (y, −x). For another centre, subtract that centre, rotate the relative coordinates, then add it back. Here 270° anticlockwise is also labelled 90° clockwise.',
      },
      {
        heading: 'Dilation changes distances from the centre',
        text: 'For centre (h, k) and positive scale factor s, the new point is (h + s(x − h), k + s(y − k)). Side lengths multiply by s and area by s². Factors from 0.1 to 5 are supported; a factor below 1 reduces the shape. Translations, reflections and rotations preserve side lengths.',
      },
      {
        heading: 'Supported shapes and limits',
        text: 'Use a simple polygon with 3–6 distinct vertices entered around its perimeter. Zero-area and crossing shapes are rejected. Input and output coordinates must stay within −50 to 50. This tool applies one transformation at a time, with no matrix input or automatic composition. A4/Letter PDFs use a separate answer page; CSV includes original and image coordinates.',
      },
    ],
    faq: [
      {
        q: 'Can I rotate around a point other than the origin?',
        a: 'Yes. Enter Centre X and Centre Y for rotation or dilation. A small cross marks the centre on the diagram. Rotation angles are limited to quarter, half and three-quarter turns.',
      },
      {
        q: 'Can I reflect across any line?',
        a: 'This version supports the x-axis, y-axis, y = x and y = −x. An arbitrary line or a function transformation is outside this tool’s scope.',
      },
      {
        q: 'Why has the grid changed size?',
        a: 'The range automatically includes every original and transformed vertex and the selected centre. X and Y units remain equal. A result beyond −50 to 50 produces an error rather than hiding a vertex.',
      },
    ],
    source: {
      name: 'GeoGebra manual: transformation tools',
      url: 'https://geogebra.github.io/docs/manual/en/tools/Transformation_Tools/',
    },
  },
  quadratic: {
    title: 'Quadratic Graph Calculator — Vertex, Roots & Free PDF | ChartsAI',
    description:
      'Graph y = ax² + bx + c and find its vertex, real roots and axis of symmetry. Explore the curve, use practice mode and download a free worksheet with answers.',
    answer:
      'Graph a quadratic in the form y = ax² + bx + c. Enter its three coefficients to see the parabola, vertex, axis of symmetry, real roots and y-intercept. A calculated table connects the equation to the curve, and practice mode creates a printable graphing exercise.',
    purpose:
      'For learning how a quadratic equation, its key features and a plotted parabola describe the same function.',
    steps: [
      'Enter a, b and c from y = ax² + bx + c. Use the sign as part of each coefficient: x² − 2x − 3 has a = 1, b = −2 and c = −3.',
      'Read the vertex, discriminant and real roots. Move c with the slider to shift the parabola vertically and watch the intercepts change.',
      'Choose Practice mode to sketch the graph and calculate the features yourself. Download an A4 or Letter worksheet with an optional answer page.',
    ],
    exampleTitle: 'One equation. A vertex. Two crossings.',
    example: [
      'For y = x² − 2x − 3, the vertex X coordinate is −b/(2a) = 1. Substituting x = 1 gives y = −4, so the vertex is (1, −4) and the axis of symmetry is x = 1.',
      'The discriminant is (−2)² − 4(1)(−3) = 16. The real roots are −1 and 3, equally spaced from x = 1. Since a is positive, the parabola opens upward. At x = 0, y = −3, giving the y-intercept.',
    ],
    method: [
      {
        heading: 'Find the vertex and direction',
        text: 'For a nonzero quadratic coefficient a, the vertex has h = −b/(2a) and k = ah² + bh + c. Its symmetry line is x = h. Positive a opens upward with a minimum; negative a opens downward with a maximum. The coefficient c gives the y-intercept directly.',
      },
      {
        heading: 'Use the discriminant to understand roots',
        text: 'D = b² − 4ac determines the real roots. A positive value gives two distinct real roots, zero gives one repeated real root, and a negative value gives no real roots. The calculator uses the quadratic formula with a numerically stable rearrangement. Results are numerical approximations, not symbolic proofs; complex roots are not displayed.',
      },
      {
        heading: 'Read the scales before comparing shapes',
        text: 'The plotted window includes the vertex, y-intercept and any real roots. X and Y use independent scales, so the curve’s apparent width can change when the window changes. Read the tick values instead of comparing width between separate exports. The curve joins 401 evenly spaced samples and includes the computed vertex and root positions.',
      },
      {
        heading: 'Input and download limits',
        text: 'Enter coefficients rather than a free-form equation. The absolute value of a must be from 0.1 to 10; b and c must be between −20 and 20. Fractions and dot decimals work. At a = 0 the expression is linear, so this quadratic tool asks for a nonzero value. The CSV provides five calculated points centred on the vertex; PNG and SVG contain the graph, while PDF contains the worksheet or worked solution.',
      },
    ],
    faq: [
      {
        q: 'Can I enter an equation in vertex form?',
        a: 'The controls accept standard-form coefficients. Expand y = a(x − h)² + k first: b = −2ah and c = ah² + k. For example, y = (x − 1)² − 4 becomes y = x² − 2x − 3.',
      },
      {
        q: 'Why does my graph have no x-intercepts?',
        a: 'When b² − 4ac is negative, the quadratic has no real roots. The parabola stays above or below the x-axis. Try the No real roots preset to see an example.',
      },
      {
        q: 'Can students check an answer without seeing it immediately?',
        a: 'Yes. Practice mode shows the equation and a blank graph window. Reveal answers displays the curve and calculations. The PDF question page remains blank even after the screen answers are revealed.',
      },
    ],
    source: {
      name: 'OpenStax: quadratic functions',
      url: 'https://openstax.org/books/algebra-and-trigonometry-2e/pages/5-1-quadratic-functions',
    },
  },
};

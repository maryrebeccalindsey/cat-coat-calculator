import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '/components/card.tsx';

const CatColorCalculator = () => {
  const [sireColor, setSireColor] = useState('');
  const [damColor, setDamColor] = useState('');
  const [sireSilver, setSireSilver] = useState(false);
  const [damSilver, setDamSilver] = useState(false);
  const [sirePattern, setSirePattern] = useState('solid');
  const [damPattern, setDamPattern] = useState('solid');
  const [sireWhite, setSireWhite] = useState('');
  const [damWhite, setDamWhite] = useState('');
  const [results, setResults] = useState({
    boys: [] as string[],
    girls: [] as string[],
    note: '',
  });

  const calculateColors = () => {
    let boysColors: string[] = [];
    let girlsColors: string[] = [];
    let notes: string[] = [];

    // Check for missing parent colors
    if (!sireColor || !damColor) {
      return {
        boys: ['Please select colors for both parents'],
        girls: ['Please select colors for both parents'],
        note: 'Both parents must have a color selected to calculate possible kitten colors.',
      };
    }

    // Check for white parents
    if (sireColor === 'White' && damColor === 'White') {
      return {
        boys: [
          'Such mating is prohibited due to the high lethality of kittens',
        ],
        girls: [
          'Such mating is prohibited due to the high lethality of kittens',
        ],
        note: 'Breeding two white cats is not recommended due to health risks and likelihood of deafness.',
      };
    }

    // Handle white gene inheritance
    if (sireColor === 'White' || damColor === 'White') {
      boysColors.push('White', 'Black', 'Blue');
      girlsColors.push(
        'White',
        'Black',
        'Black Smoke',
        'Blue',
        'Blue Smoke',
        'Tortie',
        'Tortie Smoke'
      );
      notes.push(
        'White color is dominant. Some kittens will be white, possibly masking their genetic color.'
      );
    }

    // Basic color inheritance
    const processBaseColors = () => {
      // Black and Blue inheritance
      if (
        (sireColor === 'Black' || sireColor === 'Blue') &&
        (damColor === 'Black' || damColor === 'Blue')
      ) {
        boysColors.push('Black', 'Blue');
        girlsColors.push('Black', 'Blue');
      }

      // Red mother inheritance
      if (damColor === 'Red') {
        // All male kittens will be Red/Cream from a red mother
        boysColors.push('Red', 'Cream');

        // Female kittens' color depends on father's color
        if (sireColor === 'Black' || sireColor === 'Blue') {
          girlsColors.push('Tortie', 'Blue Tortie');
        } else if (sireColor === 'Red' || sireColor === 'Cream') {
          girlsColors.push('Red', 'Cream');
        }
        notes.push(
          'Red coloring in females follows a special inheritance pattern. It is more rare to have red females.'
        );
      }

      // Red father inheritance
      if (sireColor === 'Red' || sireColor === 'Cream') {
        if (damColor !== 'Red') {
          // We already handled red mother above
          boysColors.push('Red', 'Cream');
          if (damColor === 'Tortie' || damColor === 'Blue Tortie') {
            girlsColors.push('Red', 'Cream', 'Tortie', 'Blue Tortie');
          } else if (damColor === 'Black' || damColor === 'Blue') {
            girlsColors.push('Tortie', 'Blue Tortie', 'Black');
          }
        }
      }

      // Tortie inheritance (only females can be tortie and calico colors)
      if (damColor === 'Tortie' || damColor === 'Blue Tortie') {
        boysColors.push('Black', 'Red');
        girlsColors.push('Tortie', 'Blue Tortie', 'Black');
      }

       // If DamColor is Cream
      if (damColor === 'Cream') {
         boysColors.push('Cream', 'Red',);
        girlsColors.push('Tortie', 'Blue Tortie', 'Tortie Smoke');
      }
      
    };
    
    
   

    processBaseColors();

    // Pattern inheritance
    const inheritedPatterns: string[] = [];
    if (sirePattern !== 'solid' || damPattern !== 'solid') {
      if (sirePattern === damPattern) {
        inheritedPatterns.push(sirePattern);
      } else {
        inheritedPatterns.push('tabby');
        if (sirePattern === 'blotched' || damPattern === 'blotched')
          inheritedPatterns.push('blotched');
        if (sirePattern === 'mackerel' || damPattern === 'mackerel')
          inheritedPatterns.push('mackerel');
        if (sirePattern === 'spotted' || damPattern === 'spotted')
          inheritedPatterns.push('spotted');
      }
    }

    // Apply patterns to colors
    if (inheritedPatterns.length > 0) {
      const patterned = [...boysColors]
        .map((color) =>
          inheritedPatterns.map((pattern) => `${color} ${pattern}`)
        )
        .flat();
      boysColors = [...boysColors, ...patterned];

      const patternedGirls = [...girlsColors]
        .map((color) =>
          inheritedPatterns.map((pattern) => `${color} ${pattern}`)
        )
        .flat();
      girlsColors = [...girlsColors, ...patternedGirls];
    }

    // Silver gene inheritance
    if (sireSilver || damSilver) {
      const silverColors = [...boysColors].map((color) => `${color} silver or smoke`);
      boysColors = [...boysColors, ...silverColors];

      const silverGirls = [...girlsColors].map((color) => `${color} silver or smoke`);
      girlsColors = [...girlsColors, ...silverGirls];

      notes.push(
        'Silver and smoke genes are dominant; some kittens will definitely inherit the silver or smoke coloring.'
      );
    }

    // White spotting inheritance
    // White spotting inheritance
    if (sireWhite) {
      const whitePatternText = {
        '01': 'van',
        '02': 'harlequin',
        '03': 'bicolor',
        '09': 'with white spots'
      }[sireWhite];
      notes.push(`Any of the colors can be displayed in ${whitePatternText} pattern.`);
    }
  
    if (damWhite) {
      const whitePatternText = {
        '01': 'van',
        '02': 'harlequin',
        '03': 'bicolor',
        '09': 'with white spots'
      }[damWhite];
      notes.push(`Any of the colors can be displayed in ${whitePatternText} pattern.`);
    }

    // Remove duplicates and sort
    boysColors = [...new Set(boysColors)].sort();
    girlsColors = [...new Set(girlsColors)].sort();

    // Return results only if we have actual colors
    return {
      boys: boysColors,
      girls: girlsColors,
      note: notes.join(' '),
    };
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Cats Color Genetic Calculator</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Father's section */}
          <div>
            <h3 className="text-xl mb-4">Father's color</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Father's basic color (*)
              </label>
              <select
                className="w-full p-2 border rounded"
                value={sireColor}
                onChange={(e) => setSireColor(e.target.value)}
              >
                <option value="">Choose the color</option>
                <option value="Black">Black</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Cream">Cream</option>
                <option value="White">White</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sireSilver}
                  onChange={(e) => setSireSilver(e.target.checked)}
                  className="mr-2"
                />
                Father has silver or smoke
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Father's white
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sireWhite"
                    value="01"
                    checked={sireWhite === '01'}
                    onChange={(e) => setSireWhite(e.target.value)}
                    className="mr-2"
                  />
                   (van)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sireWhite"
                    value="02"
                    checked={sireWhite === '02'}
                    onChange={(e) => setSireWhite(e.target.value)}
                    className="mr-2"
                  />
                   (harlequin)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sireWhite"
                    value="03"
                    checked={sireWhite === '03'}
                    onChange={(e) => setSireWhite(e.target.value)}
                    className="mr-2"
                  />
                   (bicolor)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sireWhite"
                    value="09"
                    checked={sireWhite === '09'}
                    onChange={(e) => setSireWhite(e.target.value)}
                    className="mr-2"
                  />
                  (with white spots)
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Father's pattern
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sirePattern"
                    value="solid"
                    checked={sirePattern === 'solid'}
                    onChange={(e) => setSirePattern(e.target.value)}
                    className="mr-2"
                  />
                  Without patterns - solid color
                </label>
                {['tabby', 'blotched', 'mackerel', 'spotted', 'ticked'].map(
                  (pattern, index) => (
                    <label key={pattern} className="flex items-center">
                      <input
                        type="radio"
                        name="sirePattern"
                        value={pattern}
                        checked={sirePattern === pattern}
                        onChange={(e) => setSirePattern(e.target.value)}
                        className="mr-2"
                      />
                      {pattern}
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Mother's section */}
          <div>
            <h3 className="text-xl mb-4">Mother's color</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Mother's basic color (*)
              </label>
              <select
                className="w-full p-2 border rounded"
                value={damColor}
                onChange={(e) => setDamColor(e.target.value)}
              >
                <option value="">Choose the color</option>
                <option value="Black">Black</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Cream">Cream</option>
                <option value="Tortie">Tortie</option>
                <option value="Blue Tortie">Blue Tortie</option>
                <option value="White">White</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={damSilver}
                  onChange={(e) => setDamSilver(e.target.checked)}
                  className="mr-2"
                />
                Mother has silver or smoke
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Mother's white
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="damWhite"
                    value="01"
                    checked={damWhite === '01'}
                    onChange={(e) => setDamWhite(e.target.value)}
                    className="mr-2"
                  />
                  (van)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="damWhite"
                    value="02"
                    checked={damWhite === '02'}
                    onChange={(e) => setDamWhite(e.target.value)}
                    className="mr-2"
                  />
                  (harlequin)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="damWhite"
                    value="03"
                    checked={damWhite === '03'}
                    onChange={(e) => setDamWhite(e.target.value)}
                    className="mr-2"
                  />
                  (bicolor)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="damWhite"
                    value="09"
                    checked={damWhite === '09'}
                    onChange={(e) => setDamWhite(e.target.value)}
                    className="mr-2"
                  />
                  (with white spots)
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Mother's pattern
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="damPattern"
                    value="solid"
                    checked={damPattern === 'solid'}
                    onChange={(e) => setDamPattern(e.target.value)}
                    className="mr-2"
                  />
                  Without patterns - solid color
                </label>
                {['tabby', 'blotched', 'mackerel', 'spotted', 'ticked'].map(
                  (pattern, index) => (
                    <label key={pattern} className="flex items-center">
                      <input
                        type="radio"
                        name="damPattern"
                        value={pattern}
                        checked={damPattern === pattern}
                        onChange={(e) => setDamPattern(e.target.value)}
                        className="mr-2"
                      />
                     {pattern}
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setResults(calculateColors())}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Get a result
          </button>
        </div>

        {(results.boys.length > 0 || results.girls.length > 0) && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-2">
                Boys kittens possible colors:
              </h4>
              <div className="mb-4">
                <p className="font-semibold">Base colors:</p>
                {results.boys.map((color, index) => (
                  <p key={index}>{color}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">
                Girls kittens possible colors:
              </h4>
              <div className="mb-4">
                <p className="font-semibold">Base colors:</p>
                {results.girls.map((color, index) => (
                  <p key={index}>{color}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {results.note && (
          <div className="mt-6">
            <h4 className="font-bold text-lg mb-2">Tip</h4>
            <p>{results.note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CatColorCalculator;

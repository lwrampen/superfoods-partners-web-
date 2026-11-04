# E-mailhandtekening — hosting van de afbeeldingen

Deze map wordt door Next.js op de site-root geserveerd. Alles wat hier staat is
publiek bereikbaar op:

```
https://superfoodspartners.com/signature/<bestandsnaam>
```

Gmail laat handtekening-afbeeldingen alleen zien als ze via zo'n echte `https://`
URL geladen worden (Google Drive-links en data-URI's worden gestript). Daarom
staan de bestanden hier en niet in Drive.

## Wat er in deze map hoort

| Bestand | Wie levert | Wordt op de site | Specificatie |
|---|---|---|---|
| `sfp-logo.png` | **staat er al** | `…/signature/sfp-logo.png` | SFP endorsement-logo (blok + wordmark) |
| `pmp-logo-forest.png` | **staat er al** | `…/signature/pmp-logo-forest.png` | Pure Matcha Partners, forest-groen |
| `handtekening-balk.gif` | **jij toevoegen** | `…/signature/handtekening-balk.gif` | 880×70 px, wordt op 440 breed getoond (de animerende balk, bv. "NOW AVAILABLE: UBE POWDER") |
| `portret-<voornaam>.png` | **jij toevoegen** | `…/signature/portret-<voornaam>.png` | vierkant, minimaal 400×400 px. Bv. `portret-leonard.png` |
| `handtekening-balk-rond.gif` | **staat er** (handtekening 5B) | `…/signature/handtekening-balk-rond.gif` | 868×70 px, getoond op 434×35; pil-vorm met afgeronde uiteinden op de kaartkleur #FBFFF6 |
| `portret-leonard-kleur.png` | **staat er** (handtekening 5B) | `…/signature/portret-leonard-kleur.png` | 512×512, kleurportret (rond getoond op 82 px) |
| `portret-leonard-groen-wijd.png` | **staat er** (handtekening 5B, actief) | `…/signature/portret-leonard-groen-wijd.png` | 512×512, portret op limegroen (rond getoond op 92 px) |
| `portret-jade-groen-wijd.png` | **staat er** (handtekening 5B) | `…/signature/portret-jade-groen-wijd.png` | 512×512, portret op limegroen (rond getoond op 92 px) |

Eén `handtekening-balk.gif` voor iedereen; per teamlid één eigen
`portret-<voornaam>.png`.

## Onderhoud (nieuw seizoensproduct)

Nieuwe balk? Overschrijf **hetzelfde bestand** `handtekening-balk.gif` in deze map
(zelfde naam). Iedereen heeft daarna automatisch de nieuwe balk — niemand hoeft
zijn Gmail-handtekening opnieuw in te stellen. Dat is precies waarom de balk een
los bestand is en geen HTML.

## Live zetten

Deze map staat in de `public/`-folder, dus zodra de wijziging naar `main` gaat,
deployt Vercel 'm en zijn de URL's hierboven live. Een nieuwe of overschreven
`.gif` is na de eerstvolgende deploy zichtbaar.

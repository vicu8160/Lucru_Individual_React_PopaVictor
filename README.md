# 👨‍🍳 Gourmet Explorer

Aplicație web pentru explorarea rețetelor culinare și generarea automată a listei de cumpărături. Utilizatorul poate răsfoi o colecție de rețete, le poate salva la favorite și poate adăuga mai multe rețete pe o listă comună de cumpărături, unde ingredientele identice sunt agregate automat și scalate în funcție de numărul de porții dorit.

**Autor:** Popa Victor  
**Tip proiect:** Lucru Individual - React

## Descriere generală

Gourmet Explorer este o aplicație de tip *recipe manager* care rezolvă o problemă concretă: atunci când vrei să gătești mai multe feluri de mâncare, trebuie să compui manual lista de cumpărături adunând ingredientele din fiecare rețetă și combinând cantitățile celor care se repetă. Aplicația automatizează acest proces — utilizatorul selectează rețetele dorite, ajustează numărul de porții pentru fiecare, iar lista de cumpărături finală este generată automat, cu cantitățile însumate corect și exprimate în aceleași unități de măsură.

## Funcționalități

### Pagina principală (Home)
- Afișarea tuturor rețetelor sub formă de grid cu imagini, denumire, timp de preparare și dificultate
- **Căutare** după denumirea rețetei (filtrare în timp real)
- **Filtrare** după nivelul de dificultate (Ușor / Mediu / Greu)
- **Sortare** după mai multe criterii: timp de preparare (crescător/descrescător), alfabetic (A-Z / Z-A), dificultate (de la cel mai ușor la cel mai greu și invers)
- Stare vizuală pentru cazul în care niciun rezultat nu corespunde criteriilor

### Pagina de detalii (RecipeDetail)
- Imagine de copertă, descriere, timp de preparare, număr de porții și badge colorat pentru dificultate
- Lista completă de ingrediente cu cantități și unități de măsură
- Pașii de preparare numerotați
- Buton pentru adăugarea/eliminarea rețetei de pe lista de cumpărături
- Buton pentru adăugarea/eliminarea rețetei de la favorite
- Navigare înapoi la pagina anterioară
- Tratarea cazului în care rețeta nu există (id invalid)

### Lista de cumpărături (Cart)
- Lista rețetelor selectate cu posibilitatea de a ajusta numărul de porții pentru fiecare (butoane +/−)
- **Agregarea automată a ingredientelor** — ingredientele identice din rețete diferite sunt însumate automat
- **Scalarea cantităților** proporțional cu numărul de porții ales (ex: dacă rețeta originală e pentru 4 porții și utilizatorul cere 6, toate cantitățile sunt înmulțite cu 1.5)
- Tag care indică din câte rețete provine fiecare ingredient
- **Bifare** a ingredientelor deja adunate (se salvează în localStorage)
- **Copiere** a listei în clipboard, formatată ca text
- **Printare** a listei
- Ștergere a unei rețete individuale sau golire completă a coșului

### Favorite
- Pagină dedicată cu toate rețetele marcate ca favorite
- Contor de rețete salvate
- Ștergere individuală sau în bloc (cu dialog de confirmare)

### Persistență
- Atât **coșul de cumpărături**, cât și **rețetele favorite** și **starea bifată** a ingredientelor sunt salvate în `localStorage`, deci rămân disponibile între sesiuni (nu se pierd la refresh sau la închiderea browserului).

## Tehnologii folosite

| Tehnologie | Versiune | Rol |
|------------|----------|-----|
| React | 19 | Framework UI |
| React Router | 7 | Rutare client-side între pagini |
| Vite | 8 | Build tool și dev server (cu HMR) |
| ESLint | 10 | Verificarea calității codului |

## Concepte React aplicate

Proiectul demonstrează practica următoarelor concepte fundamentale din ecosistemul React:

- **Componente funcționale** și descompunerea UI-ului în componente reutilizabile (`RecipeCard`, `Navbar`)
- **Hook-uri**: `useState`, `useEffect`, `useReducer`, `useParams`, `useNavigate`
- **Context API** pentru gestionarea stării globale (coșul și favoritele) — separat în două context-uri independente (`CartContext`, `FavoritesContext`)
- **`useReducer`** pentru logica complexă a coșului (adăugare, eliminare, actualizare porții, hidratare din storage)
- **Hook-uri custom** (`useCart`, `useFavorites`) pentru a încapsula consumul context-urilor
- **React Router** cu rute dinamice (`/recipe/:id`) și navigare programatică
- **Persistența stării** prin `localStorage` cu hidratare la mount
- **Filtrare, sortare și căutare** derivate din state cu `Array.filter` / `Array.sort`

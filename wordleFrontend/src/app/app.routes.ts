import { Routes } from '@angular/router';
import { Home } from "./home/home";
import { Game } from "./game/game";
import { Admin } from "./admin/admin";
import { WordSuggestion} from './word-suggestion/word-suggestion';
import { PageNotFound} from './page-not-found/page-not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'game', component: Game},
  { path: 'admin', component: Admin },
  { path: 'word-suggestion', component: WordSuggestion },

  //wildcard route (page-not-found) for unknown paths
  { path: '**', component: PageNotFound },
];

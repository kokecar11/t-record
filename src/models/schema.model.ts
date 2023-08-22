import type { Marker } from "./marker.model";
import type { Plan } from "./plan.model";
import type { Subscription } from "./subscription.model";

export interface Database {
  public: {
    Tables: {
      task: {
        Row: Marker
      },
      plan:{
        Row: Plan
      },
      subscription:{
        Row: Subscription
      }
    }
  }
}
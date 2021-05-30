import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptionID:string,
  custumerID: string,
  createAction= false,
) {
  const userRef = await fauna.query(
   q.Select(
     "ref",
     q.Get(
      q.Match(
        q.Index('user_by_stripe_custumer_id'),
        custumerID
      )
     )
   )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionID);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,

  };
  
  if (createAction) {
    await fauna.query(
      q.Create(
        q.Collection('susbscriptions'),
        { data: subscriptionData}
      )
    );
  } else {
    await fauna.query(q.Replace(
      q.Select(
        'ref',
        q.Get(
          q.Match(
            q.Index('subscription_by_id'),
            subscriptionID,
          )
        )
      ),
      { data: subscriptionData }
    ))
  }
}
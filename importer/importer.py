import tinycards
from tinycards.model.side import Side
from tinycards.model.concept import Concept
from tinycards.model.fact import Fact
from tinycards.model.deck import Deck
from tinycards.model.card import Card

from pprint import pprint as pp

user = 'footless@gmail.com'
password = 'concerto-swoon-demark'


def make_new_card(user_id):
    return (
        Side(user_id=user_id, concepts=[Concept(fact=Fact("the dog"),
            user_id=user_id)]),
        Side(user_id=user_id, concepts=[Concept(fact=Fact("der Hund"),
            user_id=user_id)]),
    )


def update_a_deck(client):
    new_card = make_new_card(client.user_id)

    all_decks = client.get_decks()
    d = all_decks[0]
    deck = client.get_deck(d.id)
    deck.add_card(new_card)
    client.update_deck(deck)


def create_a_new_deck(client):
    (front, back) = make_new_card(client.user_id)
    new_deck = Deck(title="its a new deck", cards=[Card(front, back,
        user_id=client.user_id)])
    new_deck.user_id = client.user_id

    client.create_deck(new_deck)


def main():
    client  = tinycards.Tinycards(user, password)
    print(client.user_id)
    s = client.data_source.session
    update_a_deck(client)
    # create_a_new_deck(client)


if __name__ == '__main__':
    main()

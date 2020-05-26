using System;
using System.Collections.Generic;
using System.Linq;
using Cartas.Web.Domain.Models;

namespace Cartas.Web.Domain.Logic
{
    public class Game
    {
        public Game(string gameId, GameType gameType, Player masterPlayer)
        {
            GameId = gameId;
            GameType = gameType;
            MasterPlayer = masterPlayer;
            ActivePlayers = new List<Player>();
            WaitingPlayers = new List<Player>();
            AddPlayer(masterPlayer);
        }

        public string GameId { get; }
        public GameType GameType { get; }
        public bool Started { get; set; }
        public Player MasterPlayer { get; }
        public List<Player> ActivePlayers { get; private set; }
        public List<Player> WaitingPlayers { get; }
        public PotentialWinner PotentialWinner { get; private set; }
        
        public Card LastPlayedCard;
        public int SeatTurn => ActivePlayers[_playerTurnIndex].Seat;
        public string Goal => Constants.Goals[_goalIndex];


        private int _totalDecks;
        private Queue<Card> _deckCards;
        private int _playerTurnIndex;
        private int _goalIndex;
        private List<Card> _playedCards = new List<Card>();


        private int PlayerCount => ActivePlayers.Count + WaitingPlayers.Count;

        public bool AddPlayer(Player player)
        {
            if (ActivePlayers.Any(x => x.PlayerId == player.PlayerId)) return true;
            if (WaitingPlayers.Any(x => x.PlayerId == player.PlayerId)) return true;
            if (PlayerCount > Constants.MaxPlayers) return false;

            var takenSeats = ActivePlayers.Union(WaitingPlayers).Select(x => x.Seat).ToList();
            player.Seat = Constants.Seats.First(x => !takenSeats.Contains(x));

            if (Started)
            {
                WaitingPlayers.Add(player);
            }
            else
            {
                ActivePlayers.Add(player);
            }

            return true;
        }

        public Player GetPlayer(string playerId)
        {
            return ActivePlayers.SingleOrDefault(x => x.PlayerId == playerId)
                   ?? WaitingPlayers.SingleOrDefault(x => x.PlayerId == playerId);
        }

        public void Start()
        {
            SetUpDecks();
            SetUpPlayers();
            LastPlayedCard = _deckCards.Dequeue();
            _playedCards = new List<Card> { LastPlayedCard };
            Started = true;
            PotentialWinner = null;
        }

        public string ChangeGoal()
        {
            _goalIndex++;

            if (_goalIndex >= Constants.Goals.Length)
                _goalIndex = 0;

            return Goal;
        }

        public bool PlayCard(Player player, Card card)
        {
            if (ActivePlayers[_playerTurnIndex].PlayerId != player.PlayerId)
                return false;

            if (player.Cards.Count == Constants.MinCards)
                return false;

            if (player.Cards.Remove(card) == false)
                return false;

            _playedCards.Add(card);
            LastPlayedCard = card;
            ChangeTurn();

            return true;
        }

        public Card TakeDeckCard(Player player)
        {
            if (ActivePlayers[_playerTurnIndex].PlayerId != player.PlayerId)
                return null;

            if (player.Cards.Count == Constants.MaxCards)
                return null;

            if (!_deckCards.Any())
                ReShufflePlayedCards();

            var card = _deckCards.Dequeue();

            player.Cards.Add(card);

            return card;
        }

        public Card TakePlayedCard(Player player)
        {
            if (ActivePlayers[_playerTurnIndex].PlayerId != player.PlayerId)
                return null;

            if (player.Cards.Count == Constants.MaxCards)
                return null;

            if (LastPlayedCard == null)
                return null;

            var card = _playedCards.Last();
            _playedCards.Remove(card);
            LastPlayedCard = null;

            player.Cards.Add(card);

            return card;
        }

        public void SetSnapshot(Player player, string snapshot)
        {
            PotentialWinner = new PotentialWinner
            {
                Player = player,
                Snapshot = snapshot
            };
        }

        public string RemovePlayer(int seat)
        {
            var playerInActive = ActivePlayers.SingleOrDefault(x => x.Seat == seat);
            var playerInWaiting = WaitingPlayers.SingleOrDefault(x => x.Seat == seat);

            if (playerInWaiting == null && playerInActive == null)
                return null;

            if (playerInWaiting != null)
            {
                WaitingPlayers.RemoveAll(x => x.PlayerId == playerInWaiting.PlayerId);
            }

            if (playerInActive != null)
            {
                if (ActivePlayers[_playerTurnIndex].PlayerId == playerInActive.PlayerId) 
                    ChangeTurn();

                _playedCards.AddRange(playerInActive.Cards);

                ActivePlayers.RemoveAll(x => x.PlayerId == playerInActive.PlayerId);
            }

            return playerInActive?.PlayerId ?? playerInWaiting?.PlayerId;
        }

        private void ChangeTurn()
        {
            _playerTurnIndex++;

            if (_playerTurnIndex >= ActivePlayers.Count)
                _playerTurnIndex = 0;
        }

        private void SetUpDecks()
        {
            _totalDecks = Tools.GetDecksFromPlayerCount(PlayerCount);

            _deckCards = new Queue<Card>();
            var deckCards = new List<Card>();

            for (int deck = 0; deck < _totalDecks; deck++)
            {
                for (int suit = 1; suit <= 4; suit++)
                {
                    for (int num = 1; num <= 13; num++)
                    {
                        deckCards.Add(new Card(num, suit));
                    }
                }

                //Add Jokers
                deckCards.Add(new Card(1, 0));
                deckCards.Add(new Card(2, 0));
            }

            foreach (var card in deckCards.OrderBy(x => Guid.NewGuid()).ThenBy(x => Guid.NewGuid()))
            {
                _deckCards.Enqueue(card);
            }
        }

        private void SetUpPlayers()
        {
            _playerTurnIndex = 0;
            ActivePlayers.AddRange(WaitingPlayers);
            ActivePlayers = ActivePlayers.OrderBy(x => Guid.NewGuid()).ToList();
            WaitingPlayers.Clear();
            
            var seats = Constants.Seats.Take(ActivePlayers.Count).OrderBy(x => x).ToList();

            for (var i = 0; i < ActivePlayers.Count; i++)
            {
                var player = ActivePlayers[i];
                player.Seat = seats[i];
                player.Cards = new List<Card>();

                for (int j = 0; j < Constants.InitialCardCount; j++)
                {
                    player.Cards.Add(_deckCards.Dequeue());
                }
            }
        }

        private void ReShufflePlayedCards()
        {
            var tmp = _playedCards.Take(_playedCards.Count - 1).OrderBy(x => Guid.NewGuid()).ThenBy(x => Guid.NewGuid()).ToList();

            foreach (var card in tmp)
            {
                _deckCards.Enqueue(card);
            }

            _playedCards = new List<Card>
            {
                _playedCards.Last()
            };
        }
    }
}
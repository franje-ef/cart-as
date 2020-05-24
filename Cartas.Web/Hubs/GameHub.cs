using System.Threading.Tasks;
using Cartas.Web.Domain.Logic;
using Cartas.Web.Domain.Models;
using Microsoft.AspNet.SignalR;

namespace Cartas.Web.Hubs
{
    public class GameHub : Hub
    {
        public override Task OnConnected()
        {
            var playerId = Context.QueryString["PlayerId"];
            var gameId = Context.QueryString["GameId"];

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);

            Clients.Group(gameId).playerConnected(player);

            Groups.Add(Context.ConnectionId, gameId);

            return base.OnConnected();
        }

        public void StartGame()
        {
            var playerId = Context.QueryString["PlayerId"];
            var gameId = Context.QueryString["GameId"];
            var game = App.GetGame(gameId);

            if (game.MasterPlayer.PlayerId == playerId)
            {
                game.Start();
                Clients.Group(gameId).onGameStarted();
            }
        }

        public void ChangeGoal()
        {
            var playerId = Context.QueryString["PlayerId"];
            var gameId = Context.QueryString["GameId"];
            var game = App.GetGame(gameId);

            if (game.MasterPlayer.PlayerId == playerId)
            {
                var goal = game.ChangeGoal();
                Clients.Group(gameId).onGoalChanged(goal);
            }
        }

        public bool PlayCard(int num, int suit)
        {
            var playerId = Context.QueryString["PlayerId"];
            var gameId = Context.QueryString["GameId"];

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);
            var result = game.PlayCard(player, new Card(num, suit));

            if (result)
            {
                Clients.Group(gameId).onCardPlayed(player.Seat, num, suit);
                Clients.Group(gameId).onTurnChanged(game.SeatTurn);
            }

            return result;
        }

        public Card TakeDeckCard()
        {
            var playerId = Context.QueryString["PlayerId"];
            var gameId = Context.QueryString["GameId"];

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);
            var result = game.TakeDeckCard(player);

            return result;
        }

        public Card TakePlayedCard()
        {
            var playerId = Context.QueryString["PlayerId"];
            var gameId = Context.QueryString["GameId"];

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);
            var result = game.TakePlayedCard(player);

            if (result != null)
            {
                Clients.Group(gameId).onPlayedCardTaken();
            }

            return result;
        }

        public void SendReaction(string reactionId)
        {
            var playerId = Context.QueryString["PlayerId"];
            var gameId = Context.QueryString["GameId"];

            var game = App.GetGame(gameId);
            var player = game.GetPlayer(playerId);

            Clients.Group(gameId).onReactionSent(player.Seat, reactionId);
        }
    }
}
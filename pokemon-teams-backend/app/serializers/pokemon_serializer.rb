class PokemonSerializer
  # include FastJsonapi::ObjectSerializer
  # attributes :nickname, :species
  # belongs_to :trainer

  def initialize(pokemon)
    @pokemon=pokemon
  end

  def to_serialized_json
    options={
      include: {
        trainer:{
          only: [:name]
        }
      }
    }
    @pokemon.to_json(options)
  end

end

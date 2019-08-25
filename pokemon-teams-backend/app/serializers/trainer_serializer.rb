class TrainerSerializer
  # include FastJsonapi::ObjectSerializer
  # attributes :name
  # has_many :pokemons

  def initialize(object)
    @trainer = object
  end

  def to_serialized_json
    options = {
      include:{
        pokemons:{
          only: [:species, :nickname, :id]
        }
      }
    }
    @trainer.to_json(options)
  end

end
